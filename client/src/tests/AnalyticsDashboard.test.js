import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import axios from 'axios';

jest.mock('axios');

const mockStore = configureStore([thunk]);

describe('AnalyticsDashboard Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: true,
                user: {
                    role: 'admin'
                }
            }
        });

        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => 'test-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AnalyticsDashboard />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders error state when API call fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AnalyticsDashboard />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch analytics data')).toBeInTheDocument();
        });
    });

    test('renders analytics data correctly', async () => {
        const mockData = {
            report: {
                summary: {
                    totalDrugs: 100,
                    averageDemand: 50,
                    peakDemand: 200,
                    lowDemand: 10
                },
                historicalData: [
                    { date: '2024-01-01', quantity: 100 },
                    { date: '2024-01-02', quantity: 150 }
                ],
                predictions: [
                    { date: '2024-01-03', predictedQuantity: 180 },
                    { date: '2024-01-04', predictedQuantity: 200 }
                ]
            }
        };

        axios.get.mockResolvedValueOnce({ data: mockData });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AnalyticsDashboard />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument(); // Total Drugs
            expect(screen.getByText('50')).toBeInTheDocument(); // Average Demand
            expect(screen.getByText('200')).toBeInTheDocument(); // Peak Demand
            expect(screen.getByText('10')).toBeInTheDocument(); // Low Demand
        });
    });

    test('updates date range and fetches new data', async () => {
        const mockData = {
            report: {
                summary: {
                    totalDrugs: 100,
                    averageDemand: 50,
                    peakDemand: 200,
                    lowDemand: 10
                },
                historicalData: [],
                predictions: []
            }
        };

        axios.get.mockResolvedValue({ data: mockData });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AnalyticsDashboard />
                </BrowserRouter>
            </Provider>
        );

        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');

        fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
        fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                '/api/analytics/report',
                expect.objectContaining({
                    params: {
                        startDate: '2024-01-01',
                        endDate: '2024-01-31'
                    }
                })
            );
        });
    });
}); 