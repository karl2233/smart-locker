package com.karlsamaha.smart_locker_backend.menu.repository;

import com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto;
import com.karlsamaha.smart_locker_backend.menu.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @Query("""
            SELECT new com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto(
                i.itemId,
                cs.categorySelectedId,
                i.itemTitle,
                i.itemDesc,
                i.itemImageUrl,
                i.price
            )
            FROM Item i
            JOIN i.categorySelected cs
            WHERE cs.categorySelectedId = :categorySelectedId
            """)
    List<ItemResponseDto> findItemsByCategorySelectedId(
            @Param("categorySelectedId") Long categorySelectedId
    );
    boolean existsByCategorySelected_CategorySelectedId(
            Long categorySelectedId
    );
}
