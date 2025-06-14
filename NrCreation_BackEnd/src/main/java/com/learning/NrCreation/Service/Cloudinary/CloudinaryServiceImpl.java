package com.learning.NrCreation.Service.Cloudinary;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
    }

    @Override
    public void deleteImage(String imageUrl) throws IOException {
        String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1).split("\\.")[0];
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "invalidate", true
        ));
    }
}
