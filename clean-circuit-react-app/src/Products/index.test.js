import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../Products/index';

import * as fetchProducts from '../utils/fetchProducts';
import * as addProduct from '../utils/addProduct';
import * as updateProduct from '../utils/updateProducts';
import * as deleteProduct from '../utils/deleteProduct';

jest.mock('../utils/fetchProducts');
jest.mock('../utils/addProducts');
jest.mock('../utils/updateProducts');
jest.mock('../utils/deleteProduct');

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
});
afterAll(() => {
  if (global.URL.createObjectURL?.mockRestore) {
    global.URL.createObjectURL.mockRestore();
  }
});

describe('ProductTable component', () => {
  const mockProducts = [
    {
      id: 1,
      upcycled_clothes: 'Dress',
      type: 'cotton',
      quantity: 10,
      price: 20,
      image: null,
      updated_at: '2025-08-08T10:00:00Z'
    },
    {
      id: 2,
      upcycled_clothes: 'Jeans',
      type: 'denim',
      quantity: 5,
      price: 50,
      image: null,
      updated_at: '2025-08-07T10:00:00Z'
    },
    {
      id: 3,
      upcycled_clothes: 'Jacket',
      type: 'leather',
      quantity: 3,
      price: 100,
      image: null,
      updated_at: '2025-08-06T10:00:00Z'
    },
    {
      id: 4,
      upcycled_clothes: 'Skirt',
      type: 'silk',
      quantity: 6,
      price: 30,
      image: null,
      updated_at: '2025-08-05T10:00:00Z'
    },
    {
      id: 5,
      upcycled_clothes: 'Shirt',
      type: 'linen',
      quantity: 12,
      price: 15,
      image: null,
      updated_at: '2025-08-04T10:00:00Z'
    },
    {
      id: 6,
      upcycled_clothes: 'Hat',
      type: 'wool',
      quantity: 7,
      price: 12,
      image: null,
      updated_at: '2025-08-03T10:00:00Z'
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchProductsApi.fetchProducts.mockResolvedValue(mockProducts);
    addProductApi.addProduct.mockResolvedValue({});
    updateProductApi.updateProduct.mockResolvedValue({});
    deleteProductApi.deleteProduct.mockResolvedValue({});
  });

  test('renders products with pagination and enables Prev/Next buttons properly', async () => {
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalled());
    expect(screen.getByText('Dress')).toBeInTheDocument();
    expect(screen.getByText('Jeans')).toBeInTheDocument();
    expect(screen.getByText('Jacket')).toBeInTheDocument();
    expect(screen.getByText('Skirt')).toBeInTheDocument();
    expect(screen.getByText('Shirt')).toBeInTheDocument();
    expect(screen.queryByText('Hat')).not.toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();

    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByText('Hat')).toBeInTheDocument();
    expect(screen.queryByText('Dress')).not.toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Prev')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  test('opens add product modal and closes modal on cancel', async () => {
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/Add Product/i));
    expect(screen.getByPlaceholderText(/Enter product name/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(screen.queryByPlaceholderText(/Enter product name/i)).not.toBeInTheDocument();
  });

  test('opens edit product modal with pre-filled data', async () => {
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalled());
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(screen.getByDisplayValue('Dress')).toBeInTheDocument();
  });

  test('submits add product form successfully and refreshes list', async () => {
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText(/Add Product/i));
    const nameInput = screen.getByPlaceholderText(/Enter product name/i);
    const typeInput = screen.getByLabelText(/Type/i);
    const quantityInput = screen.getByPlaceholderText(/Enter quantity/i);
    const priceInput = screen.getByPlaceholderText(/Enter price/i);
    fireEvent.change(nameInput, { target: { value: 'New Dress' } });
    fireEvent.change(typeInput, { target: { value: 'cotton' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });
    fireEvent.change(priceInput, { target: { value: '25' } });
    fireEvent.submit(screen.getByTestId('product-form'));

    await waitFor(() => {
      expect(addProductApi.addProduct).toHaveBeenCalled();
    });
  });

  test('submits edit product form and closes modal', async () => {
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalled());
    fireEvent.click(screen.getAllByText('Edit')[0]);
    const nameInput = screen.getByDisplayValue('Dress');
    fireEvent.change(nameInput, { target: { value: 'Updated Dress' } });
    fireEvent.submit(screen.getByTestId('product-form'));
    await waitFor(() => {
      expect(updateProductApi.updateProduct).toHaveBeenCalled();
      expect(screen.queryByDisplayValue('Updated Dress')).not.toBeInTheDocument();
    });
  });

  test('deletes product after confirm and updates list', async () => {
    window.confirm = jest.fn(() => true);
    render(<ProductList />);
    await waitFor(() => expect(fetchProductsApi.fetchProducts).toHaveBeenCalled());
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(deleteProductApi.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
    });
  });
});

