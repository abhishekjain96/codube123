package com.acoopa.backend;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MediaConfig implements WebMvcConfigurer {

    private final String location;

    public MediaConfig(@Value("${media.dir}") String dir) throws Exception {
        Path root = Paths.get(dir).toAbsolutePath().normalize();
        Files.createDirectories(root);
        String uri = root.toUri().toString();
        this.location = uri.endsWith("/") ? uri : uri + "/";
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/media/**").addResourceLocations(location);
    }
}