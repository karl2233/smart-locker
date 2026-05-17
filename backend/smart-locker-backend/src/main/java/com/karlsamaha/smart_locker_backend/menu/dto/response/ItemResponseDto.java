package com.karlsamaha.smart_locker_backend.menu.dto.response;

import java.math.BigDecimal;

public class ItemResponseDto {

    private Long itemId;
    private Long categorySelectedId;
    private String itemTitle;
    private String itemDesc;
    private String itemImageUrl;
    private BigDecimal price;

    public ItemResponseDto(
            Long itemId,
            Long categorySelectedId,
            String itemTitle,
            String itemDesc,
            String itemImageUrl,
            BigDecimal price
    ) {
        this.itemId = itemId;
        this.categorySelectedId = categorySelectedId;
        this.itemTitle = itemTitle;
        this.itemDesc = itemDesc;
        this.itemImageUrl = itemImageUrl;
        this.price = price;
    }

    public Long getItemId() {
        return itemId;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public String getItemDesc() {
        return itemDesc;
    }

    public String getItemImageUrl() {
        return itemImageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
