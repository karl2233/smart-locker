package com.karlsamaha.smart_locker_backend.menu.entity;

import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_selected_id", nullable = false)
    private CategorySelected categorySelected;

    @Column(name = "item_title", nullable = false)
    private String itemTitle;

    @Column(name = "item_desc", columnDefinition = "TEXT")
    private String itemDesc;

    @Column(name = "item_image_url")
    private String itemImageUrl;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public Item() {
    }

    public Item(
            CategorySelected categorySelected,
            String itemTitle,
            String itemDesc,
            String itemImageUrl,
            BigDecimal price
    ) {
        this.categorySelected = categorySelected;
        this.itemTitle = itemTitle;
        this.itemDesc = itemDesc;
        this.itemImageUrl = itemImageUrl;
        this.price = price;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public CategorySelected getCategorySelected() {
        return categorySelected;
    }

    public void setCategorySelected(CategorySelected categorySelected) {
        this.categorySelected = categorySelected;
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

    public String getItemImageUrl() {
        return itemImageUrl;
    }

    public void setItemImageUrl(String itemImageUrl) {
        this.itemImageUrl = itemImageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
