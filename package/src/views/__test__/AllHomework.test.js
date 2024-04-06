import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import AllHomework from '../AllHomework.js';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('AllHomework component', () => {
  beforeEach(() => {
    axiosMock.get.mockResolvedValue({ data: [{ id: 1, title: 'Namų darbas', num_questions: 5 }] });
  });

  test('renders list of homework', async () => {
    render(<BrowserRouter><AllHomework /></BrowserRouter>);
    expect(await screen.findByText('Namų darbas')).toBeInTheDocument();
  });

  test('calls deleteHomework when delete button is clicked', async () => {

    axiosMock.delete.mockResolvedValueOnce({ status: 204 });
    render(<BrowserRouter><AllHomework /></BrowserRouter>);
    
    const deleteButton = await screen.findByText('✖');
    fireEvent.click(deleteButton);
    const okButton = await screen.findByText('Taip');
    fireEvent.click(okButton);

    expect(axiosMock.delete).toHaveBeenCalled();
  });
  

  test('shows error message when delete request fails', async () => {
      axiosMock.delete.mockRejectedValueOnce({ response: { data: { error: 'Nepavyko ištrinti' } } });
      render(<BrowserRouter><AllHomework/></BrowserRouter>);
  
      const deleteButton = await screen.findByText('✖');
      fireEvent.click(deleteButton);
      const okButton = await screen.findByText('Taip');
      fireEvent.click(okButton);
  
      const errorMessage = await screen.findByText('Klaida! Nepavyko ištrinti');
      expect(errorMessage).toBeInTheDocument();
  });
    
});
