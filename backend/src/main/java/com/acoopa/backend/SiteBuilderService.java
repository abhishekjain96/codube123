package com.acoopa.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import jakarta.annotation.PreDestroy;

@Service
public class SiteBuilderService {

    private static final Logger log = LoggerFactory.getLogger(SiteBuilderService.class);

    private final AiService ai;
private final ObjectMapper mapper = JsonMapper.builder().build();
    private final ExecutorService pool = Executors.newFixedThreadPool(4);

    public SiteBuilderService(AiService ai) {
        this.ai = ai;
    }

    @PreDestroy
    void shutdown() {
        pool.shutdown();
    }

    /** idea -> blueprint -> every page in parallel -> one site JSON */
    public String generate(String idea) {
        long start = System.currentTimeMillis();
        try {
            String blueprintText = ai.generateBlueprint(idea);
            JsonNode bp = mapper.readTree(blueprintText);

            JsonNode planned = bp.path("pages");
            if (!planned.isArray() || planned.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Blueprint has no pages");
            }

            List<CompletableFuture<JsonNode>> futures = new ArrayList<>();
            for (JsonNode p : planned) {
                String slug = p.path("slug").asText("/");
                futures.add(CompletableFuture.supplyAsync(() -> buildPage(blueprintText, slug), pool));
            }

            ArrayNode pages = mapper.createArrayNode();
            for (CompletableFuture<JsonNode> f : futures) {
                JsonNode page = f.join();
                if (page != null) {
                    pages.add(page);
                }
            }
            if (pages.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No page could be generated");
            }

            ObjectNode site = mapper.createObjectNode();
            site.put("reply", bp.path("reply").asText(""));
            site.set("brand", bp.path("brand"));
            site.set("theme", bp.path("theme"));
            site.set("nav", bp.path("nav"));
            site.set("pages", pages);

            log.info("Site built: {} of {} pages in {} ms", pages.size(), planned.size(),
                    System.currentTimeMillis() - start);
            return mapper.writeValueAsString(site);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Site build failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Site build failed");
        }
    }
        /** Re-writes ONE page of a saved site from a change request. Theme may change too. */
    public String editPage(String siteJson, String slug, String instruction) {
        try {
            JsonNode parsed = mapper.readTree(siteJson);
            JsonNode pagesNode = parsed.path("pages");
            if (!parsed.isObject() || !pagesNode.isArray()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a multi-page site");
            }
            ObjectNode root = (ObjectNode) parsed;
            ArrayNode pages = (ArrayNode) pagesNode;

            int at = -1;
            for (int i = 0; i < pages.size(); i++) {
                if (slug.equals(pages.get(i).path("slug").asText())) {
                    at = i;
                }
            }
            if (at < 0) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Page not found");
            }

            // a short outline of the site, so the AI keeps links and style consistent
            ObjectNode brief = mapper.createObjectNode();
            brief.set("brand", root.path("brand"));
            brief.set("theme", root.path("theme"));
            brief.set("nav", root.path("nav"));
            ArrayNode outline = brief.putArray("pages");
            for (JsonNode pg : pages) {
                ObjectNode o = outline.addObject();
                o.put("slug", pg.path("slug").asText());
                ArrayNode types = o.putArray("sections");
                for (JsonNode s : pg.path("sections")) {
                    types.add(s.path("type").asText());
                }
            }

            String raw = ai.editPage(mapper.writeValueAsString(brief),
                    mapper.writeValueAsString(pages.get(at)), instruction);
            JsonNode edited = mapper.readTree(raw);
            if (!edited.path("sections").isArray()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI returned an invalid page");
            }
            ObjectNode page = (ObjectNode) edited;
            page.put("slug", slug);

            JsonNode theme = page.remove("theme");
            if (theme != null && theme.isObject()) {
                JsonNode old = root.path("theme");
                ObjectNode merged = old.isObject() ? ((ObjectNode) old).deepCopy() : mapper.createObjectNode();
                merged.setAll((ObjectNode) theme);
                root.set("theme", merged);
            }
            pages.set(at, page);
            return mapper.writeValueAsString(root);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Page edit failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Page edit failed");
        }
    }

    private JsonNode buildPage(String blueprint, String slug) {
        for (int attempt = 1; attempt <= 2; attempt++) {
            try {
                JsonNode n = mapper.readTree(ai.generatePage(blueprint, slug));
                if (n.path("sections").isArray() && n instanceof ObjectNode obj) {
                    obj.put("slug", slug);
                    return obj;
                }
            } catch (Exception e) {
                log.warn("Page {} attempt {} failed: {}", slug, attempt, e.getMessage());
            }
        }
        return null;
    }
}