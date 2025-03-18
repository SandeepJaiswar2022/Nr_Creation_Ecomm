package com.learning.NrCreation.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Image {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String fileName;
	
	private String fileType;
	
	@Lob
	@Basic(fetch = FetchType.LAZY)
	private byte[] image;
	
	private String downloadUrl;
	
	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;

}
