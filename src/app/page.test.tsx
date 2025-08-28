// @vitest-environment jsdom
import React from 'react'
import '@testing-library/jest-dom/vitest'
import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react';
import Home from './page';

test('home page renders without crashing', () => {
  render(<Home />)
  expect(screen.getByText('Designer studio')).toBeInTheDocument()
})
