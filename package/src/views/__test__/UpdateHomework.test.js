import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import UpdateHomework from '../UpdateHomework';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'; 

jest.mock('axios');

describe('UpdateHomework component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({
          data: {
            title: 'Namų darbas',
            pairs: [
              {
                id: 1,
                qtype: 1,
                question: 'Klausimas',
                answer: 'Atsakymas',
                points: 10,
                options: ['Pasirinkimas 1', 'Pasirinkimas 2'],
                correct_options: [0]
              }
            ]
          }
        });
      });

  test('adds a new option field when "Pridėti pasirinkimą" button is clicked', async () => {
    render(<BrowserRouter><UpdateHomework /></BrowserRouter>);
    let addButton;
    await waitFor(() => {
        addButton = screen.getByText('pasirinkimas');
    });
    fireEvent.click(addButton);

    const optionFields = screen.getAllByTestId('option');
    expect(optionFields.length).toBe(3); 
  });

  test('adds a new question when "Pridėti klausimą" button is clicked', async () => {
    render(<BrowserRouter><UpdateHomework /></BrowserRouter>);
    let addButton;
    await waitFor(() => {
        addButton = screen.getByText('Pridėti klausimą');
    });
    fireEvent.click(addButton);

    const questionFields = screen.getAllByLabelText('Klausimas');
    expect(questionFields.length).toBe(2); 
  });

  test('initially renders with one question', async () => {
    render(<BrowserRouter><UpdateHomework /></BrowserRouter>);
    let questionFields;
    await waitFor(() => {
        questionFields = screen.getAllByLabelText('Klausimas');
    });
    expect(questionFields.length).toBe(1);
  });

  test('disables "Pridėti klausimą" button when maximum number of questions is reached', async () => {
    render(<BrowserRouter><UpdateHomework /></BrowserRouter>);
    let addButton;
    await waitFor(() => {
       addButton = screen.getByText('Pridėti klausimą');
    });

    for (let i = 0; i < 15; i++) {
      fireEvent.click(addButton);
    }

    fireEvent.click(addButton);
    expect(addButton).toBeDisabled();
  });

  test('submits form with invalid data', async () => {
    render(<BrowserRouter><UpdateHomework /></BrowserRouter>);
    let homeworkNameInput;
    await waitFor(() => {
        homeworkNameInput = screen.getByLabelText('Namų darbo pavadinimas');
    });
    fireEvent.change(homeworkNameInput, { target: { value: 'Namų darbas' } });

    const questionField = screen.getByLabelText('Klausimas');
    fireEvent.change(questionField, { target: { value: 'Klausimas?' } });

    const addButton = screen.getByText('pasirinkimas');
    fireEvent.click(addButton);

    const optionField = screen.getAllByTestId('option');
    fireEvent.change(optionField[0], { target: { value: 'pasirinkimas 2' } });

    const pointsField = screen.getByTestId('points0');
    fireEvent.change(pointsField, { target: { value: '15' } });

    const submitButton = screen.getByText('Įrašyti');
    fireEvent.click(submitButton);

    const failMessage = await screen.findByText('Klaida!');
    expect(failMessage).toBeInTheDocument();
  });
});
