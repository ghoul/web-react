import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import AllHomework from './AllHomework.js';
import { BrowserRouter } from 'react-router-dom';

//const axiosMock = require('axios');

jest.mock('axios');

describe('AllHomework component', () => {
  beforeEach(() => {
    axiosMock.get.mockResolvedValue({ data: [{ id: 1, title: 'Homework 1', num_questions: 5 }] });
  });

  test('renders list of homework', async () => {
    render(<BrowserRouter><AllHomework /></BrowserRouter>);
    expect(await screen.findByText('Homework 1')).toBeInTheDocument();
  });

  test('renders message when no homework available', async () => {
    axiosMock.get.mockResolvedValue({ data: [] });
    render(<BrowserRouter><AllHomework /></BrowserRouter>);
    expect(await screen.findByText('Namų darbų nėra')).toBeInTheDocument();
  });

  test('calls deleteHomework when delete button is clicked', async () => {
    axiosMock.delete.mockResolvedValueOnce({ status: 204 });
    render(<BrowserRouter><AllHomework /></BrowserRouter>);
    const deleteButton = await screen.findByText('✖');
    fireEvent.click(deleteButton);
    expect(axiosMock.delete).toHaveBeenCalled();
  });

//   test('shows error message when delete request fails', async () => {
//     axiosMock.delete.mockRejectedValueOnce({ response: { data: { error: 'Delete failed' } } });
//     render(<AllHomework />);
//     const deleteButton = await screen.findByText('✖');
//     fireEvent.click(deleteButton);
//     await waitFor(() => expect(screen.getByText('Klaida! Delete failed')).toBeInTheDocument());
//   });
    test('shows error message when delete request fails', async () => {
        // Mocking the delete request to return an error response
        axiosMock.delete.mockRejectedValueOnce({ response: { data: { error: 'Delete failed' } } });
    
        // Rendering the component
        render(<BrowserRouter><AllHomework /></BrowserRouter>);
    
        // Finding the delete button and clicking it
        const deleteButton = await screen.findByText('✖');
        fireEvent.click(deleteButton);
    
        // Verifying that the error message appears
        const errorMessage = await screen.findByText('Klaida! Delete failed');
        expect(errorMessage).toBeInTheDocument();
  });

  // Add more tests as needed
});
