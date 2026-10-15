package com.acoopa.backend;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Project> create(@AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(jwt.getSubject(), req.idea()));
    }

    @GetMapping
    public List<Project> list(@AuthenticationPrincipal Jwt jwt) {
        return service.list(jwt.getSubject());
    }

    @GetMapping("/{id}")
    public Project get(@AuthenticationPrincipal Jwt jwt, @PathVariable String id) {
        return service.find(jwt.getSubject(), id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    @PutMapping("/{id}")
    public Project update(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
            @Valid @RequestBody UpdateProjectRequest req) {
        return service.update(jwt.getSubject(), id, req)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }
    @PostMapping("/{id}/chat")
public ChatResponse chat(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
        @Valid @RequestBody ChatRequest req) {
    return service.chat(jwt.getSubject(), id, req.message())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
}
@PutMapping("/{id}/site")
public Project saveSite(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
        @Valid @RequestBody SiteRequest req) {
    return service.saveSite(jwt.getSubject(), id, req.siteJson())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
}

@PostMapping("/{id}/compile")
public CompileResponse compile(@AuthenticationPrincipal Jwt jwt, @PathVariable String id) {
    return service.compile(jwt.getSubject(), id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
}
}