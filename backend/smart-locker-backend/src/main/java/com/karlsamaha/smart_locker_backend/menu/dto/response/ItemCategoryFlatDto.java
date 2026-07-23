package com.karlsamaha.smart_locker_backend.menu.dto.response;

import java.math.BigDecimal;

public class ItemCategoryFlatDto {

    private Long categorySelectedId;
    private String categoryName;
    private String itemName;
    private BigDecimal itemPrice;
    private String itemDescription;

    public ItemCategoryFlatDto(
            Long categorySelectedId,
            String categoryName,
            String itemName,
            BigDecimal itemPrice,
            String itemDescription
    ) {
        this.categorySelectedId = categorySelectedId;
        this.categoryName = categoryName;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemDescription = itemDescription;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getItemName() {
        return itemName;
    }

    public BigDecimal getItemPrice() {
        return itemPrice;
    }

    public String getItemDescription() {
        return itemDescription;
    }
}
