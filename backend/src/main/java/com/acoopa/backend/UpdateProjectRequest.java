package com.acoopa.backend;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProjectRequest(
        @NotBlank @Size(max = 200) String heading,
        boolean dark,
        @Pattern(regexp = "^#[0-9a-fA-F]{6}$") String accent) {
}