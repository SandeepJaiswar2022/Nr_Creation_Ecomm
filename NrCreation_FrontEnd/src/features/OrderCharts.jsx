import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderCharts = ({ orders }) => {
    // Process data for visualizations
    const processOrderData = (orders) => {
        // Line Chart: Order Amount Over Time
        const ordersByDate = orders.reduce((acc, order) => {
            const date = new Date(order.orderDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            const existing = acc.find((item) => item.date === date);
            if (existing) {
                existing.amount += order.orderAmount;
            } else {
                acc.push({ date, amount: order.orderAmount });
            }
            return acc;
        }, []);

        // Pie Chart: Order Status Distribution
        const statusDistribution = orders.reduce((acc, order) => {
            acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
            return acc;
        }, {});
        const statusData = Object.entries(statusDistribution).map(([name, value]) => ({
            name,
            value,
        }));

        return { ordersByDate, statusData };
    };

    const { ordersByDate, statusData } = processOrderData(orders);

    // Colors for charts
    const COLORS = ['#871845', '#f9a8d4', '#fce7f3', '#fed7e2'];

    return (
        <Card className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <CardHeader>
                <CardTitle className="text-sm sm:text-base font-medium text-[#871845]">
                    Orders Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Line Chart: Order Amount Over Time */}
                    <div className="bg-rose-50 rounded-lg p-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#871845] mb-2">
                            Order Amount Over Time
                        </h4>
                        <div className="h-[200px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ordersByDate}>
                                    <XAxis dataKey="date" fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderColor: '#871845',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#871845"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Order Status */}
                    <div className="bg-rose-50 rounded-lg p-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#871845] mb-2">
                            Order Status
                        </h4>
                        <div className="h-[200px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        labelLine={false}
                                    >
                                        {statusData.map((entry, index) => (
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



export default OrderCharts;