import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { CalorieScreen } from './CalorieScreen';

test('Search Main Screen renders with the correct header', () => {
  const { getByText } = render(<CalorieScreen />);
  const textHeader = getByText('Calorie Tracker');
  expect(textHeader).toBeDefined();
});

