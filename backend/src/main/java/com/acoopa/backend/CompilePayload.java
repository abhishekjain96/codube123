package com.acoopa.backend;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CompilePayload(String reply, List<CodeFile> files) {
}
