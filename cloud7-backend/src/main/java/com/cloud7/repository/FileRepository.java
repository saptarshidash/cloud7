package com.cloud7.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloud7.entity.FileItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileItem, Long> {
    @Query("""
        SELECT f FROM FileItem f
        WHERE f.userId = :userId
          AND f.deleted = false
          AND (
               (:folderId IS NULL AND f.folderId IS NULL)
            OR (:folderId IS NOT NULL AND f.folderId = :folderId)
          )
    """)
    List<FileItem> findByUserIdAndFolderId(
            @Param("userId") Long userId,
            @Param("folderId") Long folderId
    );

    List<FileItem> findByUserIdAndDeletedTrue(Long userId);

    @Query("""
          SELECT COALESCE(SUM(f.sizeBytes), 0)
          FROM FileItem f
          WHERE f.userId = :userId AND f.deleted = false
    """)
    Long getUsedStorage(@Param("userId") Long userId);

    Optional<FileItem> findByIdAndDeletedFalse(Long id);

    @Query("""
        select coalesce(sum(f.sizeBytes), 0)
        from FileItem f
        where f.folderId = :folderId
        and f.deleted = false
    """)
    Long totalSizeInFolder(@Param("folderId") Long folderId);

    long countByFolderIdAndDeletedFalse(Long folderId);
}