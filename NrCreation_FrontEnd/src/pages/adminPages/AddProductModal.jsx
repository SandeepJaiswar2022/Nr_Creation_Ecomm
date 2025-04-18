import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { createProduct } from '@/redux/productSlice';
import toast from 'react-hot-toast';

export const AddProductModal = ({ open, setOpen }) => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/heic',
            'image/heif',
        ];

        const validImages = [];
        const previews = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name} is not a supported image format`);
                continue;
            }

            if (file.size > 1024 * 1024) {
                toast.error(`${file.name} exceeds 1MB`);
                continue;
            }

            validImages.push(file);
            previews.push(URL.createObjectURL(file));
        }

        setSelectedImages((prev) => [...prev, ...validImages]);
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        const updatedImages = [...selectedImages];
        const updatedPreviews = [...imagePreviews];

        updatedImages.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setSelectedImages(updatedImages);
        setImagePreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !price || !description || selectedImages.length === 0) {
            toast.error('Please fill all fields and add at least one image');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        selectedImages.forEach((file) => formData.append('images', file));

        try {
            await dispatch(createProduct(formData)).unwrap();
            toast.success('Product created successfully');
            setOpen(false);
            setTitle('');
            setPrice('');
            setDescription('');
            setSelectedImages([]);
            setImagePreviews([]);
        } catch (err) {
            toast.error('Error creating product');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full border px-3 py-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full border px-3 py-2 rounded"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <textarea
                        placeholder="Description"
                        className="w-full border px-3 py-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                        multiple
                        onChange={handleImageChange}
                    />

                    <div className="flex flex-wrap gap-2 mt-2">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={src}
                                    alt="preview"
                                    className="h-20 w-20 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 text-white bg-red-500 rounded-full px-1 text-xs"
                                    onClick={() => removeImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="w-full">
                        Create Product
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
