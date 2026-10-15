package com.acoopa.backend;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/projects")
public class ImageController {

    public record ImagesRequest(
            @NotNull @Size(max = 12) List<@NotBlank @Size(max = 600) String> prompts) {
    }

    private final ProjectService projects;
    private final ImageService images;

    public ImageController(ProjectService projects, ImageService images) {
        this.projects = projects;
        this.images = images;
    }

    @PostMapping("/{id}/images")
    public List<ImageService.Status> request(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
            @Valid @RequestBody ImagesRequest req) {
        projects.find(jwt.getSubject(), id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        return images.request(id, req.prompts());
    }
        @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@AuthenticationPrincipal Jwt jwt, @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        projects.find(jwt.getSubject(), id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        return Map.of("url", images.saveUpload(id, file));
    }
}