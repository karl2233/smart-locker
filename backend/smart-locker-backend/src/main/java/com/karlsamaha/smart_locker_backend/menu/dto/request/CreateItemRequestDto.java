package com.karlsamaha.smart_locker_backend.menu.dto.request;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public class CreateItemRequestDto {

    private Long categorySelectedId;
    private String itemTitle;
    private String itemDesc;
    private BigDecimal price;
    private MultipartFile image;

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public void setCategorySelectedId(Long categorySelectedId) {
        this.categorySelectedId = categorySelectedId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getItemDesc() {
        return itemDesc;
    }

    public void setItemDesc(String itemDesc) {
        this.itemDesc = itemDesc;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
