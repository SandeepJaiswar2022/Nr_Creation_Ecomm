package com.learning.NrCreation.Service.Category;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Exception.AlreadyExistException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
	private final CategoryRepository categoryRepo;
	private final CategoryRepository categoryRepository;

	@Override
	public Category getCategoryById(Long categoryId) {
		return categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException
						("Category Not Found with Id : "+categoryId));
	}

	@Override
	public Category getCategoryByName(String name) {
		return categoryRepo.findByName(name).orElseThrow(() -> new ResourceNotFoundException
				("Category Not Found with name : "+name));
	}

	@Override
	public List<Category> getAllCategories() {
		return categoryRepo.findAll();
	}

	@Override
	public Category addCategory(Category category) {
//		System.out.println("\n\ncategory : "+category.getName());
		return Optional.of(category)
				.filter(c -> !categoryRepo.existsByName(c.getName()))
				.map(categoryRepo::save)
				.orElseThrow(()->new AlreadyExistException
						("Category Already Exist with Name : "+category.getName()));
	}

	@Override
	public Category updateCategory(Category category, Long categoryId) {
		//findyById if exists then update else throw not Found
		return categoryRepo.findById(categoryId)
				.map((foundCategory -> {
					foundCategory.setName(category.getName());
					return foundCategory;
				}))
				.map(categoryRepo::save)
				.orElseThrow(() -> new ResourceNotFoundException
						("Category Not Found with Id : "+categoryId));
	}

	@Override
	public void deleteCategoryById(Long categoryId) {
		categoryRepo.findById(categoryId)
		.ifPresentOrElse(categoryRepo::delete, () -> {
			throw new ResourceNotFoundException("Category Not Found with Id : "+categoryId);
		 });
	}

}
