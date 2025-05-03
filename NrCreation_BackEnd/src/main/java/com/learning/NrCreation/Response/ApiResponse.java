package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
	private String message;
	private Object data;
}


//this could be the format for response

//{
//		"timestamp": "2025-05-03T10:07:18.185+00:00",
//		"status": 403,
//		"message": "Forbidden Access",
//		"data": Object
//}