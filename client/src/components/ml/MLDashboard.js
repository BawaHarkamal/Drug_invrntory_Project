import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MLDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/ml/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`/api/ml/analyze/${selectedYear}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchReports();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getLatestReport = () => {
    if (!reports.length) return null;
    return reports.reduce((latest, report) => 
      !latest || report.year > latest.year ? report : latest
    );
  };

  const latestReport = getLatestReport();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          ML Analytics Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generate New Report
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Year"
                  >
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={generateReport}
                  disabled={loading}
                  fullWidth
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {latestReport && (
            <>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Prediction ({latestReport.year})
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={latestReport.data.salesByMonth.map((amount, index) => ({
                            name: new Date(0, index).toLocaleString('default', { month: 'short' }),
                            actual: amount,
                            predicted: latestReport.predictions.nextYearSalesPrediction[index]
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Sales" />
                          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted Sales" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    {latestReport.recommendations.map((rec, index) => (
                      <Alert
                        key={index}
                        severity={rec.priority === 'high' ? 'error' : 'info'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle1">{rec.title}</Typography>
                        <Typography variant="body2">{rec.description}</Typography>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Seasonal Trends
                    </Typography>
                    {latestReport.predictions.seasonalTrends.map((trend, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{trend.season}</Typography>
                        <Typography variant="body2">
                          Top Categories: {trend.topCategories.join(', ')}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default MLDashboard; 