import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCardButton } from "./ProductCardButton";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

// ---- MOCK SETUP ----
// We mock the entire module that contains the useCart hook.
jest.mock("@/contexts/CartContext");

// We need a type assertion here to tell TypeScript what our mock is.
const mockedUseCart = useCart as jest.Mock;
// --------------------

describe("ProductCardButton", () => {
  // Create a mock product that we can use in all our tests
  const mockProduct: Product = {
    id: "prod_1",
    name: "Test Product",
    price: 99.99,
    category: "electronics",
    description: "A product for testing",
    sku: "TP123",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Create a mock function for addItem that we can spy on.
  const mockAddItem = jest.fn();

  // `beforeEach` runs before each test in this describe block.
  // This is a great place to reset our mocks to a clean state.
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();

    // Tell our mock to return the spy function
    mockedUseCart.mockReturnValue({
      addItem: mockAddItem
    });
  });

  it("should render the button with the correct text and icon", () => {
    // 1. Arrange
    render(<ProductCardButton product={mockProduct} />);

    // 2. Act & Assert
    // We look for a button that has the accessible name "Add".
    // This works because the icon and text are combined for accessibility.
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it("should call addItem with the correct product when clicked", async () => {
    // Set up userEvent for more realistic click simulation
    const user = userEvent.setup();

    // 1. Arrange
    render(<ProductCardButton product={mockProduct} />);
    const button = screen.getByRole("button", { name: /add/i });

    // 2. Act
    // Simulate a user clicking the button
    await user.click(button);

    // 3. Assert
    // We check if our mock 'addItem' function was called
    expect(mockAddItem).toHaveBeenCalledTimes(1);

    // We can be even more specific and check *what* it was called with
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it("should apply additional class names", () => {
    // 1. Arrange
    render(<ProductCardButton product={mockProduct} className="my-custom-class" />);

    // 2. Act & Assert
    const button = screen.getByRole("button", { name: /add/i });
    expect(button).toHaveClass("my-custom-class");
  });
});
