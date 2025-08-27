import { render, screen } from '@testing-library/react';
import Home from './page';

test('home page renders without crashing', () => {
  render(<Home />);
  expect(screen.getByText('Get started by editing')).toBeInTheDocument();
});
