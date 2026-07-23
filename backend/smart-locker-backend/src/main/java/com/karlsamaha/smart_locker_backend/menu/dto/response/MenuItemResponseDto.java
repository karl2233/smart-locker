package com.karlsamaha.smart_locker_backend.menu.dto.response;

import java.math.BigDecimal;

public class MenuItemResponseDto {

    private String itemName;
    private BigDecimal itemPrice;
    private String itemDescription;

    public MenuItemResponseDto(
            String itemName,
            BigDecimal itemPrice,
            String itemDescription
    ) {
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemDescription = itemDescription;
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
