// src/views/Simple.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Simple from './Simple';

test('renders correct sum', () => {
  render(<Simple />);
  const sumElement = screen.getByText('4');
  expect(sumElement).toBeInTheDocument();
});
