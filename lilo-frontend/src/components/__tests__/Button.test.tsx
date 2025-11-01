// Simple test example for Button component
// This follows the clean component-based design pattern

import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
  });
});