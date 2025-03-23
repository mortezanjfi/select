import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./select";

const mockOptions = [
  { key: "Option 1", value: "option1" },
  { key: "Option 2", value: "option2" },
];

describe("select.tsx", () => {
  test("init", () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByPlaceholderText("Type...")).toBeInTheDocument();
  });

  test("click input open options", async () => {
    render(<Select options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type...");

    await userEvent.click(input);
    expect(await screen.findByText("Option 1")).toBeInTheDocument();
    expect(await screen.findByText("Option 2")).toBeInTheDocument();
  });

  test("choose an item", async () => {
    render(<Select options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type...");

    await userEvent.click(input);
    const option = await screen.findByText("Option 1");

    await userEvent.click(option);
    expect(await screen.findByText(/Option 1/i)).toBeInTheDocument();
  });

  test("remove an item", async () => {
    render(<Select options={mockOptions} />);
    const input = screen.getByPlaceholderText("Type...");

    await userEvent.click(input);
    const option = await screen.findByText("Option 1");

    await userEvent.click(option);
    await userEvent.click(screen.getByText(/Option 1/i));

    expect(screen.queryByText(/Option1/i)).not.toBeInTheDocument();
  });

  test("add item", async () => {
    render(<Select options={[]} />);
    const input = screen.getByPlaceholderText("Type...");

    await userEvent.type(input, "test{enter}");

    expect(await screen.findByText("test")).toBeInTheDocument();
  });

  test("close options", async () => {
    render(
      <div>
        <Select options={mockOptions} />
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>
    );

    const input = screen.getByPlaceholderText("Type...");
    await userEvent.click(input);
    expect(await screen.findByText("Option 1")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
