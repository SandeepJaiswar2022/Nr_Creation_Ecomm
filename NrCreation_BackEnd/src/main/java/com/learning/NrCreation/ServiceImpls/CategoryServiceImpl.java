package com.learning.NrCreation.ServiceImpls;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Repository.CategoryRepository;
import com.learning.NrCreation.Service.Order.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElseThrow((exc)->new );
    }

    @Override
    public Category createCategory(Category category) {
        return null;
    }

    @Override
    public Category updateCategory(Integer id, Category category) {
        return null;
    }

    @Override
    public void deleteCategory(Integer id) {

    }
}
