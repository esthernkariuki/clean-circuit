// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
import '@testing-library/jest-dom';

beforeAll(() => {
  console.warn = (msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('React Router Future Flag Warning') ||
       msg.includes('v7_startTransition') ||
       msg.includes('v7_relativeSplatPath'))
    ) {
      return; 
    }
    originalWarn(msg, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});