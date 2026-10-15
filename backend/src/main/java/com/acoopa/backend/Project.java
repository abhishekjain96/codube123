package com.acoopa.backend;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    private String id;

    @Column(nullable = false, length = 2000)
    private String idea;

    @Column(nullable = false, length = 200)
    private String heading;

    @Column(nullable = false)
    private boolean dark;

    @Column(nullable = false, length = 7)
    private String accent;

    @Column(nullable = false)
    private Instant createdAt;
    @Column(name = "owner_id")
private String ownerId;
@Column(length = 100)
private String brand;

@Column(length = 500)
private String subheading;

@Column(length = 60)
private String primaryCta;

@Column(length = 60)
private String secondaryCta;

@ElementCollection(fetch = FetchType.EAGER)
@CollectionTable(name = "project_features", joinColumns = @JoinColumn(name = "project_id"))
private List<Feature> features = new ArrayList<>();

    protected Project() {
    }

   public Project(String id, String ownerId, String idea, String heading, boolean dark, String accent, Instant createdAt) {
    this.id = id;
    this.ownerId = ownerId;
    
    this.idea = idea;
    this.heading = heading;
    this.dark = dark;
    this.accent = accent;
    this.createdAt = createdAt;
}
@Column(columnDefinition = "TEXT")
private String siteJson;

@Column(columnDefinition = "TEXT")
private String compiledJson;
    public String getId() { return id; }
    public String getIdea() { return idea; }
    public String getHeading() { return heading; }
    public boolean isDark() { return dark; }
    public String getAccent() { return accent; }
    public Instant getCreatedAt() { return createdAt; }

    public void setHeading(String heading) { this.heading = heading; }
    public void setDark(boolean dark) { this.dark = dark; }
    public void setAccent(String accent) { this.accent = accent; }
    public String getBrand() { return brand; }
public String getSubheading() { return subheading; }
public String getPrimaryCta() { return primaryCta; }
public String getSecondaryCta() { return secondaryCta; }
public List<Feature> getFeatures() { return features; }

public void applyContent(AiSite s) {
    if (has(s.brand())) this.brand = cut(s.brand(), 100);
    if (has(s.heading())) this.heading = cut(s.heading(), 200);
    if (has(s.subheading())) this.subheading = cut(s.subheading(), 500);
    if (has(s.primaryCta())) this.primaryCta = cut(s.primaryCta(), 60);
    if (has(s.secondaryCta())) this.secondaryCta = cut(s.secondaryCta(), 60);
    if (s.accent() != null && s.accent().matches("^#[0-9a-fA-F]{6}$")) {
        this.accent = s.accent();
    }
    this.dark = s.dark();
    if (s.features() != null && !s.features().isEmpty()) {
        this.features.clear();
        s.features().stream()
                .filter(f -> f != null && has(f.title()))
                .limit(3)
                .forEach(f -> this.features.add(new Feature(
                        cut(f.title(), 100),
                        cut(f.description() == null ? "" : f.description(), 300))));
    }
}

private static boolean has(String v) {
    return v != null && !v.isBlank();
}

private static String cut(String v, int max) {
    String t = v.trim();
    return t.length() > max ? t.substring(0, max) : t;
}
public String getSiteJson() { return siteJson; }
public void setSiteJson(String siteJson) { this.siteJson = siteJson; }
public String getCompiledJson() { return compiledJson; }
public void setCompiledJson(String compiledJson) { this.compiledJson = compiledJson; }
}