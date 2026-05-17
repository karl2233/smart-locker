package com.karlsamaha.smart_locker_backend.category.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "categories_selected",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_category_selected", columnNames = "category_id")
        }
)
public class CategorySelected {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_selected_id")
    private Long categorySelectedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public CategorySelected() {
    }

    public CategorySelected(Category category) {
        this.category = category;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public void setCategorySelectedId(Long categorySelectedId) {
        this.categorySelectedId = categorySelectedId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}