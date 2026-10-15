package com.acoopa.backend;

import java.util.List;

public record AiSite(
        String reply,
        String brand,
        String heading,
        String subheading,
        String primaryCta,
        String secondaryCta,
        String accent,
        boolean dark,
        List<Feature> features) {
}