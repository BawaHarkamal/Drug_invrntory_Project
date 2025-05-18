import React, { useState, useEffect, useCallback } from 'react';
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
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DrugTrends = () => {
    const { drugId } = useParams();
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDrugTrends = useCallback(async () => {
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
    }, [drugId]);

    useEffect(() => {
        fetchDrugTrends();
    }, [fetchDrugTrends]);

    const chartData = {
        labels: trends?.historical.map(item => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Historical Demand',
                data: trends?.historical.map(item => item.quantity),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                tension: 0.1
            },
            {
                label: 'Predicted Demand',
                data: trends?.predictions.map(item => item.predictedQuantity),
                borderColor: '#1565c0',
                backgroundColor: 'rgba(21, 101, 192, 0.1)',
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

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box p={3}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Drug Demand Analysis
            </Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box height={500}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            </Paper>
        </Box>
    );
};

export default DrugTrends; 