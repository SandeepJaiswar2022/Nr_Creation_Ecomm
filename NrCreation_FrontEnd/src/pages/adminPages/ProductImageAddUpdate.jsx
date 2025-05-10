import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Trash2, Plus, Upload } from "lucide-react";
import { deleteAnImageFromProduct, fetchSingleProduct, uploadProductImages } from "@/store/slices/productSlice";
import PopupOnDelete from "@/components/ReusableComponents/PopupOnDelete";
import { PageLoader } from "@/components/ReusableComponents";

const ProductImageAddUpdate = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, productImages, loading } = useSelector((state) => state.product);
    const [showAddImagesModal, setShowAddImagesModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        imageUrl: null
    });

    useEffect(() => {
        if (productId) {
            dispatch(fetchSingleProduct(productId));
        }
    }, [dispatch, productId]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const validImages = files.filter(file => {
            // Check for duplicate files
            const isDuplicate = selectedImages.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );

            if (isDuplicate) {
                return false;
            }

            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name} is not a supported image format`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`${file.name} exceeds 5MB size limit`);
                return false;
            }
            return true;
        });

        setSelectedImages(prev => [...prev, ...validImages]);
    };

    const handleOpenDeletePopUp = (imageUrl) => {
        setDeleteConfirmation({
            isOpen: true,
            imageUrl
        });
    };

    const handleConfirmDelete = async () => {
        // Here you would typically make an API call to delete the image
        try {
            await dispatch(deleteAnImageFromProduct({ productId: product?.id, deletedImageUrl: deleteConfirmation?.imageUrl }))
                .unwrap();

            // console.log("Deleting image:", deleteConfirmation.imageUrl);

            setDeleteConfirmation({
                isOpen: false,
                imageUrl: null
            });
        } catch (error) {
            console.error("Image Deletion failed:", error);
        }

    };

    const handleSaveImages = async () => {
        // Here you would typically make an API call to save the images
        try {
            await dispatch(
                uploadProductImages({
                    productId: product?.id,
                    images: selectedImages,
                })
            ).unwrap(); // unwrap will throw if rejected

            // Only runs if upload was successful
            setShowAddImagesModal(false);
            setSelectedImages([]);
        } catch (error) {
            console.error("Upload failed:", error);
            // Optionally show an error toast or message
        }
    };

    if (loading) {
        return <PageLoader message="Loading product details..." />;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-xl font-medium">
                    Product not found
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Button>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Product ID</p>
                        <p className="font-medium">{product.id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{product.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{product.category?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">₹{product.price}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="font-medium">{product.inventory}</p>
                    </div>
                </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Product Images</h2>
                    <Button
                        onClick={() => setShowAddImagesModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Images
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productImages?.length >= 0 && productImages?.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={imageUrl}
                                alt={`Product ${index + 1}`}
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleOpenDeletePopUp(imageUrl)}
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Images Modal */}
            <Dialog open={showAddImagesModal} onOpenChange={setShowAddImagesModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Images</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <label
                            htmlFor="image-upload"
                            className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-[#fdf2f5] transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Upload className="w-8 h-8 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                    <span className="text-[#871845] hover:text-[#987c88] font-medium">
                                        Click to upload
                                    </span>
                                    <span className="text-gray-500"> or drag and drop</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, JPEG, WEBP up to 5MB
                                </p>
                            </div>
                            <Input
                                id="image-upload"
                                type="file"
                                multiple
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {selectedImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedImages(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            className="absolute top-1 right-1 h-6 w-6"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowAddImagesModal(false);
                                    setSelectedImages([]);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveImages}
                                disabled={selectedImages.length === 0}
                            >
                                Save Images
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Popup */}
            <PopupOnDelete
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({
                    isOpen: false,
                    imageUrl: null
                })}
                onConfirm={handleConfirmDelete}
                title="Delete Image"
                description="Are you sure you want to delete this image? This action cannot be undone."
                loading={loading}
            />
        </div>
    );
};

export default ProductImageAddUpdate; 