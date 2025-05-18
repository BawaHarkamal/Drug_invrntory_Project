import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DrugTrends from '../components/dashboard/DrugTrends';
import axios from 'axios';

jest.mock('axios');

const mockStore = configureStore([thunk]);

describe('DrugTrends Component', () => {
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
                    <Routes>
                        <Route path="/dashboard/drug/:drugId/trends" element={<DrugTrends />} />
                    </Routes>
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
                    <Routes>
                        <Route path="/dashboard/drug/:drugId/trends" element={<DrugTrends />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch drug trends')).toBeInTheDocument();
        });
    });

    test('renders drug trends data correctly', async () => {
        const mockData = {
            data: {
                historical: [
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
                    <Routes>
                        <Route path="/dashboard/drug/:drugId/trends" element={<DrugTrends />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Drug Demand Analysis')).toBeInTheDocument();
        });
    });

    test('handles unauthorized access', async () => {
        store = mockStore({
            auth: {
                isAuthenticated: true,
                user: {
                    role: 'user' // Non-authorized role
                }
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/dashboard/drug/:drugId/trends" element={<DrugTrends />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });
}); 