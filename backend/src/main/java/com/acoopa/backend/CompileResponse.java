package com.acoopa.backend;

import java.util.List;

public record CompileResponse(String reply, List<CodeFile> files, Project project) {
}
