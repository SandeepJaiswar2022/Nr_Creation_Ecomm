import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    X,
    ChevronDown,
    Image
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addProduct, deleteProduct, fetchAllCategories, fetchProducts, updateProduct } from "@/store/slices/productSlice"
import { PageLoader } from "@/components/ReusableComponents"
import PopupOnDelete from "@/components/ReusableComponents/PopupOnDelete"
import { useNavigate } from "react-router-dom"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ProductManagement = () => {
    const [isAddingProduct, setIsAddingProduct] = useState(false)
    const [isEditingProduct, setIsEditingProduct] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Categories");
    const [selectedStatus, setSelectedStatus] = useState("Select Status")
    const [expandedProduct, setExpandedProduct] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        productId: null,
        productName: ""
    })

    // const categories = ["all", "Dupattas", "Lehengas", "Sarees", "Kurtis", "Blouses", "Suits"]
    const statuses = ["all", "In Stock", "Low Stock", "Out of Stock"]

    const { products, loading, categories } = useSelector(store => store.product);

    const [productForm, setProductForm] = useState({
        name: "",
        category: "",
        price: "",
        size: "",
        inventory: "",
        description: "",
    });


    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchAllCategories());
    }, [dispatch])


    useEffect(() => {
        if (isEditingProduct && editingProduct) {
            setProductForm({
                name: editingProduct?.name || "",
                category: editingProduct?.category?.name || "",
                price: editingProduct?.price?.toString() || "",
                inventory: editingProduct?.inventory?.toString() || "",
                description: editingProduct?.description || "",
                size: editingProduct?.size || "",
            });
        } else {
            setProductForm({
                name: "",
                category: "",
                price: "",
                size: "",
                brand: "",
                inventory: "",
                description: "",
            });
        }
    }, [isAddingProduct, isEditingProduct, editingProduct]);





    // Filter products based on search query, category, and status
    // const filteredProducts = products.filter(product => {
    //     const searchLower = searchQuery.toLowerCase()
    //     const matchesSearch = searchQuery === "" ||
    //         product.id.toLowerCase().includes(searchLower) ||
    //         product.name.toLowerCase().includes(searchLower) ||
    //         product.category.toLowerCase().includes(searchLower) ||
    //         product.price.toLowerCase().includes(searchLower)

    //     const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    //     const matchesStatus = selectedStatus === "all" || product.status === selectedStatus

    //     return matchesSearch && matchesCategory && matchesStatus
    // })

    //Dispatch Add Product
    const handleAddProduct = () => {
        const productData = {
            ...productForm,
            price: parseFloat(productForm.price),
            inventory: parseInt(productForm.inventory, 10),
            brand: `Nr_Creation`,
            size: parseInt(productForm.size, 10),
        };
        // console.log("🟢 Adding Product:", productData);
        dispatch(addProduct(productData));
        setIsAddingProduct(false)
    };


    const handleEditProduct = (product) => {
        setIsEditingProduct(true)
        setEditingProduct(product)
    }



    const handleDeleteProduct = (productId, productName) => {
        setDeleteConfirmation({
            isOpen: true,
            productId,
            productName
        })
    }

    const handleConfirmDelete = () => {
        dispatch(deleteProduct(deleteConfirmation.productId));
        setDeleteConfirmation({
            isOpen: false,
            productId: null,
            productName: ""
        })
    }

    // const handleUpdateProduct = () => {
    //     // Update product logic here

    // }

    //dispatch Update Product
    const handleUpdateProduct = () => {
        const productData = {
            ...productForm,
            price: parseFloat(productForm.price),
            inventory: parseInt(productForm.inventory, 10),
            size: parseInt(productForm.size, 10),
            brand: `Nr_Creation`, //Setting Brand By Default
            id: editingProduct.id, // include ID if needed for backend
        };
        // console.log("🟡 Updating Product:", productData);
        dispatch(updateProduct(productData));

        setEditingProduct(null)
        setIsEditingProduct(false)
    };


    const toggleProductExpansion = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId)
    }

    if (loading) {
        return (
            <PageLoader message="Loading Products..." />
        )
    }
    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Product Management</h1>
                <Button
                    className="bg-[#871845] hover:bg-[#6a1337] text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                    onClick={() => setIsAddingProduct(true)}
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8 sm:pl-10 text-sm sm:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {categories?.map(category => (
                                    <SelectItem key={category?.id} value={category?.name}>
                                        {category?.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedStatus} >
                        <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(status => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                        onClick={() => {
                            setSelectedCategory("all")
                            setSelectedStatus("all")
                            setSearchQuery("")
                        }}
                    >
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Reset Filters
                    </Button>
                </div>
            </div>

            {/* Products List - Mobile View */}
            <div className="block sm:hidden space-y-3">
                {products.map((product) => (
                    <div key={product?.id} className="bg-white rounded-lg shadow-md p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-24 rounded-md overflow-hidden">
                                    <img
                                        src={product?.imageUrls?.[0]}
                                        alt={product?.brand}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{product?.name}</div>
                                    <div className="text-xs text-gray-500">{product?.category?.name}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleProductExpansion(product?.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedProduct === product?.id ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {expandedProduct === product?.id && (
                            <div className="space-y-3 pt-3 border-t">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="text-xs text-gray-500">Price</div>
                                        <div className="text-sm font-medium">{product?.price}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Stock</div>
                                        <div className="text-sm font-medium">{product?.inventory}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Size</div>
                                        <div className="text-sm font-medium">{product?.size}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Category</div>
                                        <div className="text-sm font-medium">{product?.category?.name}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditProduct(product)}
                                        className="flex-1 text-xs px-2 py-1"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteProduct(product?.id, product?.name)}
                                        className="flex-1 text-xs px-2 py-1 text-red-500"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/admin/products/images/${product?.id}`)}
                                        className="flex-1 text-xs px-2 py-1"
                                    >
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center">
                                                        <Image className="w-3 h-3 mr-1" />
                                                        <span>Images</span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Add/Delete Images</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Products Table - Desktop View */}
            <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

                    {products?.length === 0 ? (<div>
                        <div className="p-10 text-xl font-medium text-center">
                            No Product Found
                        </div>
                    </div>) : (
                        <div className="min-w-[800px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Image</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Product ID</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Name</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Category</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Price</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Size</th>
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Stock</th>
                                        {/* <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Status</th> */}
                                        <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(products.map((product) => (
                                        <tr key={product?.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                <div className="w-16 h-24 rounded-md overflow-hidden">
                                                    <img
                                                        src={product?.imageUrls?.[0]}
                                                        alt={product?.brand}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{product?.id}</td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                                <div className="font-medium text-sm sm:text-base">{product?.name}</div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                                <span className="px-1.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                                    {product?.category?.name}
                                                </span>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{product?.price}</td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{product?.size} {`Meters`}</td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${product?.inventory > 20 ? "bg-green-100 text-green-800" :
                                                    product?.inventory > 0 ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                    }`}>
                                                    {product?.inventory}
                                                </span>
                                            </td>
                                            {/* <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${product.status === "In Stock" ? "bg-green-100 text-green-800" :
                                                product.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td> */}
                                            <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                                <div className="flex gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditProduct(product)}
                                                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 text-red-500"
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/products/images/${product.id}`)}
                                                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                                    >
                                                        <TooltipProvider delayDuration={0}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex items-center">
                                                                        <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Add/Delete Images</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>)}

                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {(isAddingProduct || isEditingProduct) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-6 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                            <h2 className="text-xl sm:text-2xl font-bold">
                                {isAddingProduct ? "Add New Product" : "Edit Product"}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsAddingProduct(false)
                                    setIsEditingProduct(false)
                                    setEditingProduct(null)
                                }}
                                className="h-8 w-8 sm:h-10 sm:w-10"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <Input
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        placeholder="Enter product name"
                                        className="text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <Select
                                        value={productForm?.category}
                                        onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                                    >
                                        <SelectTrigger className="w-full text-sm sm:text-base">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem key={category?.id} value={category?.name}>
                                                    {category?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>

                                    <Input
                                        type="number"
                                        value={productForm?.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        placeholder="Enter price"
                                        className="text-sm sm:text-base"
                                    />

                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Size</label>

                                    <Input
                                        type="number"
                                        value={productForm?.size}
                                        onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                                        placeholder="Enter Size in Meters"
                                        className="text-sm sm:text-base"
                                    />

                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Inventory</label>
                                    <Input
                                        type="number"
                                        value={productForm.inventory}
                                        onChange={(e) => setProductForm({ ...productForm, inventory: e.target.value })}
                                        placeholder="Enter Stock"
                                        className="text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>

                                    <Textarea
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        placeholder="Enter product description"
                                        rows={4}
                                        className="text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddingProduct(false)
                                    setIsEditingProduct(false)
                                    setEditingProduct(null)
                                }}
                                className="text-sm hover:bg-red-200 sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#871845] hover:bg-[#6a1337] text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                                onClick={isAddingProduct ? handleAddProduct : handleUpdateProduct}
                            >
                                {isAddingProduct ? "Add Product" : "Update Product"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Popup */}
            <PopupOnDelete
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({
                    isOpen: false,
                    productId: null,
                    productName: ""
                })}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                description={`Are you sure you want to delete "${deleteConfirmation.productName}"? This action cannot be undone.`}
                loading={loading}
            />
        </div>
    )
}

export default ProductManagement 