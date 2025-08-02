import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Color Palette Generator heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Color Palette Generator/i);
  expect(headingElement).toBeInTheDocument();
});
