package com.karlsamaha.smart_locker_backend.menu.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public class CreateItemRequestDto {

    @NotNull(message = "categorySelectedId is required")
    private Long categorySelectedId;

    @NotBlank(message = "Item title is required")
    private String itemTitle;

    private String itemDesc;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Image is required")
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