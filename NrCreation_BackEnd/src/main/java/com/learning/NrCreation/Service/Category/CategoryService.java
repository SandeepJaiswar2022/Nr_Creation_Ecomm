package com.learning.NrCreation.Service.Category;

import com.learning.NrCreation.Entity.Category;

import java.util.List;

public interface CategoryService {
	
	Category getCategoryById(Long categoryId);
	Category getCategoryByName(String name);
	List<Category> getAllCategories();
	Category addCategory(Category category);
	Category updateCategory(Category category, Long categoryId);
	void deleteCategoryById(Long categoryId);

}
