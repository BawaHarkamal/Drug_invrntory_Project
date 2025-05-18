import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        fetchAnalyticsReport();
    }, [dateRange]);

    const fetchAnalyticsReport = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/analytics/report', {
                params: dateRange,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReport(response.data.report);
            setError(null);
        } catch (err) {
            setError('Failed to fetch analytics data');
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: report?.historicalData.map(item => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Historical Demand',
                data: report?.historicalData.map(item => item.quantity),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Predicted Demand',
                data: report?.predictions.map(item => item.predictedQuantity),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Drug Demand Analysis'
            }
        }
    };

    if (loading) return <div className="text-center">Loading analytics...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="border p-2 rounded"
                    />
                </div>
            </div>

            {report && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Total Drugs</p>
                                <p className="text-2xl font-bold">{report.summary.totalDrugs}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Average Demand</p>
                                <p className="text-2xl font-bold">{Math.round(report.summary.averageDemand)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Peak Demand</p>
                                <p className="text-2xl font-bold">{report.summary.peakDemand}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Low Demand</p>
                                <p className="text-2xl font-bold">{report.summary.lowDemand}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Demand Trends</h3>
                        <div className="h-80">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard; 