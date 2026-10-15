package com.acoopa.backend;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class ProjectService {

    private final ProjectRepository repository;
    private final AiService ai;
    private final SiteBuilderService builder;
    private final ObjectMapper mapper;

    public ProjectService(ProjectRepository repository, AiService ai, SiteBuilderService builder,
            ObjectMapper mapper) {
        this.repository = repository;
        this.ai = ai;
        this.builder = builder;
        this.mapper = mapper;
    }

    /** Old one-page pipeline (kept so existing projects keep working). */
    public Project create(String ownerId, String idea) {
        String text = idea.trim();
        String heading = text.length() > 48 ? text.substring(0, 48) + "…" : text;
        Project p = new Project(
                UUID.randomUUID().toString(), ownerId, text, heading,
                false, "#2563eb", Instant.now());
        p.setSiteJson(ai.generateSite(text));
        return repository.save(p);
    }

    /** New multi-page pipeline: blueprint, then every page, saved as the project's siteJson. */
    public Project createV2(String ownerId, String idea) {
        String text = idea.trim();
        String json = builder.generate(text);

        String brand = text.length() > 48 ? text.substring(0, 48) + "…" : text;
        String tagline = null;
        String accent = null;
        boolean dark = false;
        try {
            JsonNode root = mapper.readTree(json);
            String name = root.path("brand").path("name").asText("");
            if (!name.isBlank()) {
                brand = name;
            }
            String t = root.path("brand").path("tagline").asText("");
            tagline = t.isBlank() ? null : t;
            accent = root.path("theme").path("primary").asText(null);
            dark = root.path("theme").path("dark").asBoolean(false);
        } catch (Exception ignored) {
            // the site still saves, only the card preview uses defaults
        }

        Project p = new Project(
                UUID.randomUUID().toString(), ownerId, text, brand,
                dark, "#2563eb", Instant.now());
        p.applyContent(new AiSite(null, brand, brand, tagline, null, null, accent, dark, null));
        p.setSiteJson(json);
        return repository.save(p);
    }

    public Optional<Project> editV2(String ownerId, String id, String slug, String message) {
        return repository.findByIdAndOwnerId(id, ownerId).map(p -> {
            p.setSiteJson(builder.editPage(p.getSiteJson(), slug, message));
            return repository.save(p);
        });
    }

    public Optional<Project> find(String ownerId, String id) {
        return repository.findByIdAndOwnerId(id, ownerId);
    }

    public List<Project> list(String ownerId) {
        return repository.findAllByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    @Transactional
    public Optional<Project> update(String ownerId, String id, UpdateProjectRequest r) {
        return repository.findByIdAndOwnerId(id, ownerId).map(p -> {
            p.setHeading(r.heading());
            p.setDark(r.dark());
            p.setAccent(r.accent());
            return p;
        });
    }

    @Transactional
    public Optional<Project> saveSite(String ownerId, String id, String json) {
        return repository.findByIdAndOwnerId(id, ownerId).map(p -> {
            p.setSiteJson(json);
            return p;
        });
    }

    public Optional<ChatResponse> chat(String ownerId, String id, String message) {
        return repository.findByIdAndOwnerId(id, ownerId).map(p -> {
            String current = p.getSiteJson();
            String next = (current == null || current.isBlank())
                    ? ai.generateSite(p.getIdea() + "\nExtra request: " + message.trim())
                    : ai.editSite(current, message.trim());
            p.setSiteJson(next);
            return new ChatResponse("Done, I updated your website.", repository.save(p));
        });
    }

    public Optional<CompileResponse> compile(String ownerId, String id) {
        return repository.findByIdAndOwnerId(id, ownerId).map(p -> {
            if (p.getSiteJson() == null || p.getSiteJson().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Design is not ready yet");
            }
            String raw = ai.compileSite(p.getSiteJson());
            p.setCompiledJson(raw);
            Project saved = repository.save(p);
            try {
                CompilePayload payload = mapper.readValue(raw, CompilePayload.class);
                List<CodeFile> files = payload.files() == null ? List.of() : payload.files();
                String reply = payload.reply() == null ? "Production files are ready." : payload.reply();
                return new CompileResponse(reply, files, saved);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Compile output was not valid JSON");
            }
        });
    }
}