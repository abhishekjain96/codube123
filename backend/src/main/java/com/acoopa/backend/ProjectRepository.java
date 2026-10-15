package com.acoopa.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, String> {

    List<Project> findAllByOwnerIdOrderByCreatedAtDesc(String ownerId);

    Optional<Project> findByIdAndOwnerId(String id, String ownerId);
}