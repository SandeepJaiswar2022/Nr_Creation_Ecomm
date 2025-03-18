package com.learning.NrCreation.Response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageDTO {
    private Long id;
	
	private String fileName;
	
	private String downloadUrl;
	
}
