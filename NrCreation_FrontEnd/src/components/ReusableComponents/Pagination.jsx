import React from 'react'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

function Pagination({ selectedFilters, handlePageChange, totalPages, handlePageSizeChange }) {
    return (
        <div className="mt-10 flex flex-col gap-5 items-center justify-between">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(selectedFilters.page - 1)}
                    disabled={selectedFilters.page === 1}
                    className="hover:text-[#871845] hover:border-[#871845]"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={selectedFilters.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                            selectedFilters.page === pageNum
                                ? "bg-[#871845] text-white hover:bg-[#671234]"
                                : "hover:text-[#871845] hover:border-[#871845]"
                        }
                    >
                        {pageNum}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(selectedFilters.page + 1)}
                    disabled={selectedFilters.page === totalPages}
                    className="hover:text-[#871845] hover:border-[#871845]"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <Select
                    value={selectedFilters?.pageSize.toString()}
                    onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                    <SelectTrigger className="w-[80px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
            </div>
        </div>
    )
}

export default Pagination
