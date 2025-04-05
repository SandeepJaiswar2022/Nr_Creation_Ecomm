package com.learning.NrCreation.Service.Cloudinary;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    String uploadImage(MultipartFile file) throws IOException;
    void deleteImage(String url) throws IOException;
}
