import React from "react";
import { render, screen } from "@testing-library/react";

import { AuthGate } from "@/components/auth/AuthGate";

vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({ user: { userId: "candidate-1", roles: ["candidate"] }, loading: false, error: null }),
}));

describe("AuthGate", () => {
  it("renders children for candidate users", () => {
    render(
      <AuthGate>
        <div>candidate-only</div>
      </AuthGate>,
    );

    expect(screen.getByText("candidate-only")).toBeInTheDocument();
  });
});
