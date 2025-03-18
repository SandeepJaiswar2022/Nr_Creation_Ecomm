package com.learning.NrCreation.Controller;


import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Service.Category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/category")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class CategoryController {
	private final CategoryService categoryService;
	
	@GetMapping("/get/all")
	@PreAuthorize("hasAuthority('admin:read')")
	public ResponseEntity<ApiResponse> getAllCategories()
	{
		try {
			List<Category> categories = categoryService.getAllCategories();
			if(categories.isEmpty())
			{
				return new ResponseEntity<>(new ApiResponse("No Category Found!", new ArrayList<>()),
						HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(new ApiResponse
					("Category Fetched Successfully!",categories),
					HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse("Error : ", e.getMessage())
					,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/add")
	@PreAuthorize("hasAuthority('admin:create')")
	public ResponseEntity<ApiResponse> addCategory(@RequestBody Category category)
	{
		try {
			return new ResponseEntity<>(new ApiResponse
					("Category Added Successfully!",categoryService.addCategory(category)),
					HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse(e.getMessage(),null)
					,HttpStatus.CONFLICT);
		}
	}
	
	@GetMapping("/get/by-id/{categoryId}")
	@PreAuthorize("hasAuthority('admin:read')")
	public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long categoryId)
	{
		try {
			
			return new ResponseEntity<>(new ApiResponse
					("Category Fetched Successfully", categoryService.getCategoryById(categoryId))
					,HttpStatus.OK);
			
		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
					,HttpStatus.NOT_FOUND);
		}
	}
	
	 @GetMapping("/get/by-name")
	 @PreAuthorize("hasAuthority('admin:read')")
	 public ResponseEntity<ApiResponse> getCategoryByName(@RequestParam String name)
	 {
	     try {
	            Category category = categoryService.getCategoryByName(name);
	            return  ResponseEntity.ok(new ApiResponse("Category Found!", category));
	        } catch (Exception e) {
	            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),HttpStatus.NOT_FOUND);
	        }
	 }
	 
	 @PutMapping("/update/{categoryId}")
	 @PreAuthorize("hasAuthority('admin:update')")
	 public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long categoryId, @RequestBody Category category) {
	        try {
	            Category updatedCategory = categoryService.updateCategory(category, categoryId);
	            return ResponseEntity.ok(new ApiResponse("Category Updated Successfully!", updatedCategory));
	        } catch (Exception e) {
	            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),HttpStatus.NOT_FOUND);
	        }
	    }
	 
	 @DeleteMapping("/delete/{categoryId}")
	 @PreAuthorize("hasAuthority('admin:delete')")
	 public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long categoryId){
	        try {
	            categoryService.deleteCategoryById(categoryId);
	            return  ResponseEntity.ok(new ApiResponse("Category Deleted Successfully!", null));
	        } catch (ResourceNotFoundException e) {
	        	return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),HttpStatus.NOT_FOUND);	        
	        }
	    }
}
