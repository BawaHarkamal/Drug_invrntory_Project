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

const DrugTrends = ({ drugId }) => {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDrugTrends();
    }, [drugId]);

    const fetchDrugTrends = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/analytics/drug/${drugId}/trends`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTrends(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch drug trends');
            console.error('Error fetching drug trends:', err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: trends?.historical.map(item => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Historical Demand',
                data: trends?.historical.map(item => item.quantity),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Predicted Demand',
                data: trends?.predictions.map(item => item.predictedQuantity),
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
                text: 'Drug Demand Trends'
            }
        }
    };

    if (loading) return <div className="text-center">Loading drug trends...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Drug Demand Analysis</h3>
            <div className="h-80">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default DrugTrends; 