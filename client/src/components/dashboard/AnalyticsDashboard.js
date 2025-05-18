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
import { Box, Typography, Grid, Paper, TextField, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AnalyticsDashboard = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    const fetchAnalyticsReport = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/analytics/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
            setReport(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch analytics report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalyticsReport();
    }, [fetchAnalyticsReport]);

    const chartData = {
        labels: report?.historicalData.map(item => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Historical Demand',
                data: report?.historicalData.map(item => item.quantity),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                tension: 0.1
            },
            {
                label: 'Predicted Demand',
                data: report?.predictions.map(item => item.predictedQuantity),
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
                text: 'Drug Demand Analysis'
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
                Analytics Dashboard
            </Typography>
            
            <Box mb={3} display="flex" gap={2}>
                <TextField
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            {report && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Item>
                            <Typography variant="h6" gutterBottom>
                                Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Total Drugs
                                        </Typography>
                                        <Typography variant="h4">
                                            {report.summary.totalDrugs}
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Average Demand
                                        </Typography>
                                        <Typography variant="h4">
                                            {Math.round(report.summary.averageDemand)}
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Peak Demand
                                        </Typography>
                                        <Typography variant="h4">
                                            {report.summary.peakDemand}
                                        </Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={6}>
                                    <Item>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Low Demand
                                        </Typography>
                                        <Typography variant="h4">
                                            {report.summary.lowDemand}
                                        </Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Item>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Item>
                            <Typography variant="h6" gutterBottom>
                                Demand Trends
                            </Typography>
                            <Box height={400}>
                                <Line data={chartData} options={chartOptions} />
                            </Box>
                        </Item>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default AnalyticsDashboard; 