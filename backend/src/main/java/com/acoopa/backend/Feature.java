package com.acoopa.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record Feature(
        @Column(length = 100) String title,
        @Column(length = 300) String description) {
}