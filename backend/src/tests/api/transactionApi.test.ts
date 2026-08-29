import { afterAll, beforeEach, describe, expect, test } from "@jest/globals";

import request from "supertest";

import app from "../../app.js";
import { pool } from "../../db/db.js";
import { resetTestDb } from "../helpers/resetTestDb.js";

beforeEach(async () => {
  await resetTestDb();
});

afterAll(async () => {
  await pool.end();
});

// ======================================================
// GET /api/transactions
// ======================================================

describe("GET /api/transactions", () => {
  test("returns paginated transactions", async () => {
    const response = await request(app).get("/api/transactions").expect(200);

    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          accountId: 1,
          destinationAccountId: null,
          amount: -50,
          description: "Groceries",
          date: "2026-08-01T00:00:00.000Z",
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });
  });

  test("supports pagination query parameters", async () => {
    // Add another transaction through the API
    await request(app)
      .post("/api/transactions")
      .send({
        accountId: 1,
        amount: -25,
        description: "Dinner",
        date: "2026-08-10",
      })
      .expect(201);

    // Newest transaction comes first
    const response = await request(app)
      .get("/api/transactions?page=2&limit=1")
      .expect(200);

    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          accountId: 1,
          destinationAccountId: null,
          amount: -50,
          description: "Groceries",
          date: "2026-08-01T00:00:00.000Z",
        },
      ],
      meta: {
        page: 2,
        limit: 1,
        total: 2,
        pages: 2,
      },
    });
  });

  test("returns empty data when page exceeds available transactions", async () => {
    const response = await request(app)
      .get("/api/transactions?page=100&limit=10")
      .expect(200);

    expect(response.body.data).toEqual([]);

    expect(response.body.meta).toEqual({
      page: 100,
      limit: 10,
      total: 1,
      pages: 1,
    });
  });

  test("returns validation error for invalid page", async () => {
    const response = await request(app)
      .get("/api/transactions?page=0")
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");

    expect(response.body.error.message).toBe("Invalid transaction data");

    expect(response.body.error.details).toBeDefined();
  });

  test("rejects limit greater than 100", async () => {
    const response = await request(app)
      .get("/api/transactions?limit=101")
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

// ======================================================
// GET /api/transactions/:id
// ======================================================

describe("GET /api/transactions/:id", () => {
  test("returns an existing transaction", async () => {
    const response = await request(app).get("/api/transactions/1").expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        accountId: 1,
        destinationAccountId: null,
        amount: -50,
        description: "Groceries",
        date: "2026-08-01T00:00:00.000Z",
      },
    });
  });

  test("returns 404 for nonexistent transaction", async () => {
    const response = await request(app)
      .get("/api/transactions/999")
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Transaction does not exist",
      },
    });
  });

  test("returns 400 for invalid transaction id", async () => {
    const response = await request(app)
      .get("/api/transactions/abc")
      .expect(400);

    expect(response.body.error.code).toBe("INVALID_ID");
  });

  test("returns 400 for non-positive transaction id", async () => {
    const response = await request(app).get("/api/transactions/0").expect(400);

    expect(response.body.error.code).toBe("INVALID_ID");
  });
});

// ======================================================
// POST /api/transactions
// ======================================================

describe("POST /api/transactions", () => {
  test("creates a normal transaction", async () => {
    const input = {
      accountId: 1,
      amount: -75.5,
      description: "Restaurant",
      date: "2026-08-20",
    };

    const response = await request(app)
      .post("/api/transactions")
      .send(input)
      .expect(201);

    expect(response.body).toEqual({
      data: {
        id: 2,
        accountId: 1,
        destinationAccountId: null,
        amount: -75.5,
        description: "Restaurant",
        date: "2026-08-20T00:00:00.000Z",
      },
    });

    // Verify persistence
    const fetchResponse = await request(app)
      .get("/api/transactions/2")
      .expect(200);

    expect(fetchResponse.body.data).toEqual(response.body.data);
  });

  test("creates a transfer transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        accountId: 1,
        destinationAccountId: 2,
        amount: -250,
        description: "Transfer to savings",
        date: "2026-08-20",
      })
      .expect(201);

    expect(response.body).toEqual({
      data: {
        id: 2,
        accountId: 1,
        destinationAccountId: 2,
        amount: -250,
        description: "Transfer to savings",
        date: "2026-08-20T00:00:00.000Z",
      },
    });
  });

  test("returns validation error for invalid transaction data", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        accountId: -1,
        amount: -50,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns validation error when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        description: "Missing important stuff",
      })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns 400 when origin account does not exist", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        accountId: 999,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Origin account does not exist",
      },
    });
  });

  test("returns 400 when destination account does not exist", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        accountId: 1,
        destinationAccountId: 999,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: "BAD_REQUEST",
        message: "Destination account does not exist",
      },
    });
  });

  test("returns 400 when origin and destination are identical", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        accountId: 1,
        destinationAccountId: 1,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});

// ======================================================
// PUT /api/transactions/:id
// ======================================================

describe("PUT /api/transactions/:id", () => {
  test("fully replaces an existing transaction", async () => {
    const replacement = {
      accountId: 2,
      amount: 500,
      description: "Updated transaction",
      date: "2026-08-15",
    };

    const response = await request(app)
      .put("/api/transactions/1")
      .send(replacement)
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        accountId: 2,
        destinationAccountId: null,
        amount: 500,
        description: "Updated transaction",
        date: "2026-08-15T00:00:00.000Z",
      },
    });

    const fetchResponse = await request(app)
      .get("/api/transactions/1")
      .expect(200);

    expect(fetchResponse.body.data).toEqual(response.body.data);
  });

  test("can replace transaction with a transfer", async () => {
    const response = await request(app)
      .put("/api/transactions/1")
      .send({
        accountId: 1,
        destinationAccountId: 2,
        amount: -500,
        description: "Transfer",
        date: "2026-08-20",
      })
      .expect(200);

    expect(response.body.data.destinationAccountId).toBe(2);

    expect(response.body.data.amount).toBe(-500);
  });

  test("returns validation error for incomplete PUT", async () => {
    const response = await request(app)
      .put("/api/transactions/1")
      .send({
        amount: -100,
      })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns 404 when transaction does not exist", async () => {
    const response = await request(app)
      .put("/api/transactions/999")
      .send({
        accountId: 1,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 when replacement origin account does not exist", async () => {
    const response = await request(app)
      .put("/api/transactions/1")
      .send({
        accountId: 999,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  test("returns 400 when replacement accounts are identical", async () => {
    const response = await request(app)
      .put("/api/transactions/1")
      .send({
        accountId: 1,
        destinationAccountId: 1,
        amount: -100,
        date: "2026-08-20",
      })
      .expect(400);

    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});

// ======================================================
// PATCH /api/transactions/:id
// ======================================================

describe("PATCH /api/transactions/:id", () => {
  test("updates only supplied fields", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        amount: -125,
      })
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        accountId: 1,
        destinationAccountId: null,
        amount: -125,
        description: "Groceries",
        date: "2026-08-01T00:00:00.000Z",
      },
    });
  });

  test("can update multiple fields", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        amount: -200,
        description: "Updated groceries",
        date: "2026-08-15",
      })
      .expect(200);

    expect(response.body.data).toEqual({
      id: 1,
      accountId: 1,
      destinationAccountId: null,
      amount: -200,
      description: "Updated groceries",
      date: "2026-08-15T00:00:00.000Z",
    });
  });

  test("can add a destination account", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        destinationAccountId: 2,
      })
      .expect(200);

    expect(response.body.data.destinationAccountId).toBe(2);
  });

  test("can explicitly remove destination account with null", async () => {
    // First turn transaction into transfer
    await request(app)
      .patch("/api/transactions/1")
      .send({
        destinationAccountId: 2,
      })
      .expect(200);

    // Then explicitly clear it
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        destinationAccountId: null,
      })
      .expect(200);

    expect(response.body.data.destinationAccountId).toBeNull();
  });

  test("can explicitly clear description with null", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        description: null,
      })
      .expect(200);

    expect(response.body.data.description).toBeNull();
  });

  test("rejects empty PATCH body", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({})
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("returns 404 when transaction does not exist", async () => {
    const response = await request(app)
      .patch("/api/transactions/999")
      .send({
        amount: -100,
      })
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 when patch creates identical origin and destination", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        destinationAccountId: 1,
      })
      .expect(400);

    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  test("returns 400 when patched destination account does not exist", async () => {
    const response = await request(app)
      .patch("/api/transactions/1")
      .send({
        destinationAccountId: 999,
      })
      .expect(400);

    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});

// ======================================================
// DELETE /api/transactions/:id
// ======================================================

describe("DELETE /api/transactions/:id", () => {
  test("deletes an existing transaction", async () => {
    const response = await request(app)
      .delete("/api/transactions/1")
      .expect(204);

    // 204 should have no response body
    expect(response.text).toBe("");

    // Verify persistence
    await request(app).get("/api/transactions/1").expect(404);
  });

  test("returns 404 when transaction does not exist", async () => {
    const response = await request(app)
      .delete("/api/transactions/999")
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("returns 400 for invalid transaction id", async () => {
    const response = await request(app)
      .delete("/api/transactions/abc")
      .expect(400);

    expect(response.body.error.code).toBe("INVALID_ID");
  });
});
