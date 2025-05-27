package com.learning.NrCreation.Advice;


import com.learning.NrCreation.Exception.AlreadyExistException;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Response.ApiResponse;
import com.razorpay.RazorpayException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleInvalidInput( MethodArgumentNotValidException ex)
	{
		Map<String, String> errors = new HashMap<>();
		
		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});
		
		return new ResponseEntity<>(errors,HttpStatus.BAD_REQUEST); 
	}
	
	@ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(), 
                        ConstraintViolation::getMessage
                ));

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
	
	@ExceptionHandler(AlreadyExistException.class)
	public ResponseEntity<ApiResponse> handleAlreadyExistException(AlreadyExistException ex) {
        return new ResponseEntity<>(new ApiResponse(ex.getMessage(), null), HttpStatus.CONFLICT);
    }

	@ExceptionHandler(InvalidInputException.class)
	public ResponseEntity<ApiResponse> handleInvalidInputException(InvalidInputException ex) {
		System.out.println("InvalidInputException\n\n");
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), null), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
		System.out.println("InvalidInputException in resource not found\n\n");
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(), null), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse> handleArgumentMismatched(MethodArgumentTypeMismatchException ex) {
//		System.out.println("Invalid Argument for this API!\n\n");
		return new ResponseEntity<>(new ApiResponse("Invalid Argument for this API!", null), HttpStatus.BAD_REQUEST);
	}




	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<?> handleInvalidJson(HttpMessageNotReadableException ex) {
		Map<String, Object> errorResponse = new HashMap<>();
		errorResponse.put("timestamp", LocalDateTime.now());
		errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
		errorResponse.put("error", "Malformed JSON Request");

		return new ResponseEntity<>(new ApiResponse("Malformed JSON Request", errorResponse), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(DataAccessException.class)
	public ResponseEntity<ApiResponse> handleDataAccess(DataAccessException ex) {
		System.out.println("Database error! Please Try Later."+ "\n Time : " + LocalDateTime.now() + "\n ErrorMessage : " + ex.getMessage());
		return new ResponseEntity<>(new ApiResponse("Database error! Please Try Later.",null),HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(SQLException.class)
	public ResponseEntity<ApiResponse> handleSQL(SQLException ex) {
		System.out.println("SQL error! Please Try Later."+ "\n Time : " + LocalDateTime.now() + "\n ErrorMessage : " + ex.getMessage());
		return new ResponseEntity<>(new ApiResponse("SQL error! Please Try Later.",null),HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MalformedJwtException.class)
	public ResponseEntity<ApiResponse> handleMalformedJwtException(MalformedJwtException ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(),null),HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(RazorpayException.class)
	public ResponseEntity<ApiResponse> handleRazorPayException(RazorpayException ex) {
		return new ResponseEntity<>(new ApiResponse(ex.getMessage(),null),HttpStatus.BAD_REQUEST);
	}

//	@ExceptionHandler(Exception.class)
//	public ResponseEntity<ApiResponse> handleAllExceptions(Exception ex) {
//		ApiResponse response = new ApiResponse("An error occurred please after some time!", ex.getMessage());
//		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//	}


}
