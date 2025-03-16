package com.learning.NrCreation.ServiceImpls;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CategoryRepository;
import com.learning.NrCreation.Service.Order.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Category getCategoryById(Integer id) {
        return categoryRepository
                .findById(id)
                .orElseThrow(()->new ResourceNotFoundException("No Category found with id: " + id));
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
