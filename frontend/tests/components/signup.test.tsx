import SignUpPage from "../../pages";
import { render, screen } from "@testing-library/react";

describe("Sampleコンポーネント", () => {
  test("should first", () => {
    render(<SignUpPage />);
    screen.getByText("パスワード");
  });
});
