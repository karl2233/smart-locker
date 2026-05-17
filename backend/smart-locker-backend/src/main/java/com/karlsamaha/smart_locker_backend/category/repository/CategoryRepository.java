package com.karlsamaha.smart_locker_backend.category.repository;

import com.karlsamaha.smart_locker_backend.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
