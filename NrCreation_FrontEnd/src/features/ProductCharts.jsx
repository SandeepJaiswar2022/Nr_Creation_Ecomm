import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductCharts = ({ products }) => {
    // Process data for visualizations
    const processProductData = (products) => {
        // Bar Chart: Inventory by Product
        const inventoryData = products.map((product) => ({
            name: product.name.split(' ').slice(0, 3).join(' '),
            inventory: product.inventory,
        }));

        // Pie Chart: Price Distribution by Size
        const priceBySize = products.reduce((acc, product) => {
            const size = product.size;
            acc[size] = (acc[size] || { totalPrice: 0, count: 0 });
            acc[size].totalPrice += product.price;
            acc[size].count += 1;
            return acc;
        }, {});
        const sizeData = Object.entries(priceBySize).map(([size, data]) => ({
            name: `${size} Meter`,
            value: data.totalPrice / data.count, // Average price per size
        }));

        return { inventoryData, sizeData };
    };

    const { inventoryData, sizeData } = processProductData(products);

    // Colors for charts
    const COLORS = ['#871845', '#a84432', '#a86332', '#a83253'];

    return (
        <Card className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <CardHeader>
                <CardTitle className="text-sm sm:text-base font-medium text-[#871845]">
                    Products Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bar Chart: Inventory by Product */}
                    <div className="bg-rose-50 rounded-lg p-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#871845] mb-2">
                            Inventory by Product
                        </h4>
                        <div className="h-[200px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryData}>
                                    <XAxis dataKey="name" fontSize={10} angle={-35} textAnchor="end" />
                                    <YAxis fontSize={10} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderColor: '#871845',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Bar dataKey="inventory" fill="#871845" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Price Distribution by Size */}
                    <div className="bg-rose-50 rounded-lg p-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#871845] mb-2">
                            Price by Size
                        </h4>
                        <div className="h-[200px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sizeData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        labelLine={false}
                                    >
                                        {sizeData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderColor: '#871845',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value) => `₹${value.toFixed(2)}`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};



export default ProductCharts