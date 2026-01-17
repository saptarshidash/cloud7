package com.cloud7.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloud7.entity.Folder;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    @Query("""
        SELECT f FROM Folder f
        WHERE f.userId = :userId
          AND f.deleted = false
          AND (
               (:parentId IS NULL AND f.parentId IS NULL)
            OR (:parentId IS NOT NULL AND f.parentId = :parentId)
          )
    """)
    List<Folder> findByUserIdAndParentId(
            @Param("userId") Long userId,
            @Param("parentId") Long parentId
    );

    List<Folder> findByUserIdAndDeletedTrue(Long userId);

    long countByParentIdAndDeletedFalse(Long parentId);
}