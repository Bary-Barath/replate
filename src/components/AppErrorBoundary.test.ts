import { describe, expect, it } from 'vitest';
import AppErrorBoundary from './AppErrorBoundary';

describe('AppErrorBoundary', () => {
  it('transitions to its safe fallback state when a child throws', () => {
    const errorState = AppErrorBoundary.getDerivedStateFromError(new Error('controlled test error'));
    expect(errorState.hasError).toBe(true);
    expect(errorState.errorName).toBe('Error');

    const boundary = new AppErrorBoundary({ children: null });
    boundary.state = errorState;
    const fallback = boundary.render();
    expect(fallback).not.toBeNull();
  });
});
