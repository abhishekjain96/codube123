package com.acoopa.backend;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SiteRequest(@NotBlank @Size(max = 200000) String siteJson) {
}