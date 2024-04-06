import React from 'react';
import { render, fireEvent, screen, waitFor} from '@testing-library/react';
import AddHomework from '../AddHomework';
import { BrowserRouter } from 'react-router-dom';

describe('AddHomework component', () => {
  test('adds a new option field when "Pridėti pasirinkimą" button is clicked', async() => {
    let questionTypeSelect;
    render(<BrowserRouter><AddHomework /></BrowserRouter>);
    await waitFor(() => {
        questionTypeSelect = screen.getByLabelText('Užduotis nr. 1');
    });
    fireEvent.change(questionTypeSelect, { target: { value: 'select' } });
    const addButton = screen.getByText('pasirinkimas');
    fireEvent.click(addButton);

    const optionFields = screen.getAllByTestId('option');
    expect(optionFields.length).toBe(1); 
  });

  test('adds a new question when "Pridėti klausimą" button is clicked', async() => {
    render(<BrowserRouter><AddHomework /></BrowserRouter>);
    let addButton;
    await waitFor(() => {
        addButton = screen.getByText('Pridėti klausimą');
    });
    fireEvent.click(addButton);

    const questionFields = screen.getAllByLabelText('Klausimas');
    expect(questionFields.length).toBe(2); 
  });

  test('initially renders with one question', async() => {
    render(<BrowserRouter><AddHomework /></BrowserRouter>);
    let questionFields;

    await waitFor(() => {
        questionFields = screen.getAllByLabelText('Klausimas');
    });

    expect(questionFields.length).toBe(1);
  });

  test('disables "Pridėti klausimą" button when maximum number of questions is reached', async() => {
    render(<BrowserRouter><AddHomework /></BrowserRouter>);
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

  test('submits form with invalid data', async() => {
    render(<BrowserRouter><AddHomework /></BrowserRouter>);
    let homeworkNameInput;
    await waitFor(() => {
        homeworkNameInput = screen.getByLabelText('Namų darbo pavadinimas');
    });
    fireEvent.change(homeworkNameInput, { target: { value: 'Test Homework' } });

    const questionField = screen.getByLabelText('Klausimas');
    fireEvent.change(questionField, { target: { value: 'Test question?' } });

    const addButton = screen.getByText('pasirinkimas');
    fireEvent.click(addButton);

    const optionField = screen.getByTestId('option');
    fireEvent.change(optionField, { target: { value: 'Test option' } });

    // const setCorrectOption = screen.getByTestId('correct');
    // fireEvent.change(setCorrectOption, { target: { value: true } });
    //TODO

    const pointsField = screen.getByTestId('points0');
    fireEvent.change(pointsField, { target: { value: '15' } });

    const submitButton = screen.getByText('Įrašyti');
    fireEvent.click(submitButton);

    const failMessage = await screen.findByText('Klaida!');
    expect(failMessage).toBeInTheDocument();
  });

});
