package com.acoopa.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/v2")
public class SiteV2Controller {

    record IdeaRequest(@NotBlank @Size(max = 2000) String idea) {
    }

    record EditRequest(@NotBlank @Size(max = 100) String slug, @NotBlank @Size(max = 1000) String message) {
    }

    private final SiteBuilderService builder;
    private final ProjectService projects;

    public SiteV2Controller(SiteBuilderService builder, ProjectService projects) {
        this.builder = builder;
        this.projects = projects;
    }

    /** Preview only, nothing is saved (used by /demo/live). */
    @PostMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public String generate(@Valid @RequestBody IdeaRequest req) {
        return builder.generate(req.idea());
    }

    @PostMapping("/projects")
    public ResponseEntity<Project> create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody IdeaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projects.createV2(jwt.getSubject(), req.idea()));
    }

    @PostMapping("/projects/{id}/chat")
    public Project chat(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
            @Valid @RequestBody EditRequest req) {
        return projects.editV2(jwt.getSubject(), id, req.slug(), req.message().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }
}