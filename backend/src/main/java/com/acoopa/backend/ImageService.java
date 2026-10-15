package com.acoopa.backend;
import java.io.IOException;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import jakarta.annotation.PreDestroy;

@Service
public class ImageService {

    private static final Logger log = LoggerFactory.getLogger(ImageService.class);

    public record Status(String prompt, String url, boolean ready, boolean failed) {
    }

    record ImgResponse(List<Datum> data) {
    }

    record Datum(String b64_json) {
    }

    private final RestClient openai;
    private final String openaiKey;
    private final String model;
    private final String quality;
    private final int maxPerProject;
    private final Path root;
    private final ExecutorService pool = Executors.newFixedThreadPool(3);
    private final Set<String> inFlight = ConcurrentHashMap.newKeySet();
    private final Set<String> failed = ConcurrentHashMap.newKeySet();

    public ImageService(@Value("${openai.api-key}") String openaiKey,
            @Value("${openai.image-model}") String model,
            @Value("${openai.image-quality}") String quality,
            @Value("${media.dir}") String dir,
            @Value("${media.max-per-project}") int maxPerProject) {
        this.openaiKey = openaiKey;
        this.model = model;
        this.quality = quality;
        this.maxPerProject = maxPerProject;
        this.root = Paths.get(dir).toAbsolutePath().normalize();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(180));
        this.openai = RestClient.builder()
                .baseUrl("https://api.openai.com")
                .requestFactory(factory)
                .defaultHeader("Authorization", "Bearer " + openaiKey)
                .build();
    }

    public List<Status> request(String projectId, List<String> prompts) {
        List<Status> out = new ArrayList<>();
        Path dir = root.resolve(projectId).normalize();
        if (!dir.startsWith(root)) {
            throw new IllegalArgumentException("bad project id");
        }
        for (String raw : prompts) {
            String prompt = raw.trim();
            if (prompt.isEmpty()) {
                continue;
            }
            String name = hash(projectId + "|" + prompt) + ".png";
            String url = "/media/" + projectId + "/" + name;
            Path file = dir.resolve(name);
            String key = projectId + "/" + name;

            if (Files.exists(file)) {
                out.add(new Status(raw, url, true, false));
                continue;
            }
            if (failed.contains(key)) {
                out.add(new Status(raw, url, false, true));
                continue;
            }
            if (!inFlight.contains(key)) {
                if (openaiKey == null || openaiKey.isBlank() || count(dir) >= maxPerProject) {
                    failed.add(key);
                    out.add(new Status(raw, url, false, true));
                    continue;
                }
                if (inFlight.add(key)) {
                    pool.submit(() -> generate(prompt, file, key));
                }
            }
            out.add(new Status(raw, url, false, false));
        }
        return out;
    }

    private void generate(String prompt, Path file, String key) {
        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "prompt", prompt + " Professional quality, no watermark.",
                    "size", "1024x1024",
                    "quality", quality,
                    "n", 1);
            ImgResponse r = openai.post()
                    .uri("/v1/images/generations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(ImgResponse.class);
            if (r != null && r.data() != null && !r.data().isEmpty() && r.data().get(0).b64_json() != null) {
                byte[] bytes = Base64.getDecoder().decode(r.data().get(0).b64_json());
                Files.createDirectories(file.getParent());
                Path tmp = file.resolveSibling(file.getFileName() + ".tmp");
                Files.write(tmp, bytes);
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
                log.info("Image created: {}", key);
            } else {
                log.error("OpenAI image response was empty for {}", key);
                failed.add(key);
            }
        } catch (RestClientResponseException e) {
            log.error("OpenAI image error {}: {}", e.getStatusCode().value(), e.getResponseBodyAsString());
            failed.add(key);
        } catch (Exception e) {
            log.error("Image generation failed for {}", key, e);
            failed.add(key);
        } finally {
            inFlight.remove(key);
        }
    }

    private static long count(Path dir) {
        if (!Files.isDirectory(dir)) {
            return 0;
        }
        try (Stream<Path> s = Files.list(dir)) {
            return s.count();
        } catch (Exception e) {
            return 0;
        }
    }

    private static String hash(String s) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d).substring(0, 24);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @PreDestroy
    void shutdown() {
        pool.shutdownNow();
    }
        public String saveUpload(String projectId, MultipartFile file) {
        if (file.isEmpty() || file.getSize() > 5L * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must be up to 5 MB");
        }
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read the file");
        }
        String ext = detectType(bytes);
        if (ext == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PNG, JPG or WebP images");
        }
        Path dir = root.resolve(projectId).normalize();
        if (!dir.startsWith(root)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad project");
        }
        try {
            Files.createDirectories(dir);
            long uploads;
            try (Stream<Path> s = Files.list(dir)) {
                uploads = s.filter(f -> f.getFileName().toString().startsWith("up-")).count();
            }
            if (uploads >= 50) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Too many uploads in this project");
            }
            String name = "up-" + UUID.randomUUID().toString().replace("-", "") + "." + ext;
            Files.write(dir.resolve(name), bytes);
            return "/media/" + projectId + "/" + name;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the file");
        }
    }

    // checks the real file bytes, not the file name the browser sends
    private static String detectType(byte[] b) {
        if (b.length > 12 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return "png";
        if (b.length > 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) return "jpg";
        if (b.length > 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') return "webp";
        return null;
    }
}