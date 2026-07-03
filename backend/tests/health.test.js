describe("App Health Check", () => {
  test("should pass a basic smoke test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should have required environment variables", () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.NODE_ENV).toBe("test");
  });
});
