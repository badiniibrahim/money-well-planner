import { initializeContainer } from "@/di/container";
import { IIncomeRepository } from "@/src/application/repositories/income.repository.interface";
import { CreateIncomeUseCase } from "@/src/application/use-cases/income/create-income.use-case";
import { AuthenticationError, UnauthenticatedError } from "@/src/entities/auth";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => ({ userId: "mock-user-id" })),
}));

beforeEach(() => {
  initializeContainer();
});

describe("CreateIncomeUseCase", () => {
  const mockIncomeRepository: IIncomeRepository = {
    createIncome: vi.fn(),
  };

  let createIncomeUseCase: CreateIncomeUseCase;

  beforeEach(() => {
    createIncomeUseCase = new CreateIncomeUseCase(mockIncomeRepository);
  });

  it("Should use API_URL from environment variables", () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBe("http://localhost:3001");
  });

  it("Should create income successfully", async () => {
    const mockBudget = { id: "1", name: "Test Budget", amount: 100 };
    (mockIncomeRepository.createIncome as any).mockResolvedValue(mockBudget);

    const result = await createIncomeUseCase.execute({
      name: "Test Budget",
      amount: 100,
    });

    expect(result).toEqual(mockBudget);
    expect(mockIncomeRepository.createIncome).toHaveBeenCalledWith(
      { name: "Test Budget", amount: 100 },
      "mock-user-id"
    );
  });
});
