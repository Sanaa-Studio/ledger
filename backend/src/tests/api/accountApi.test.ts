import {
  afterAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import request from "supertest";

import app from "../../app.js";
import { pool } from "../../db/db.js";
import { resetTestDb } from "../helpers/resetTestDb.js";


// ======================================================
// SETUP
// ======================================================

beforeEach(async () => {
  await resetTestDb();
});

afterAll(async () => {
  await pool.end();
});


// ======================================================
// GET /api/accounts
// ======================================================

describe("GET /api/accounts", () => {
  test("returns paginated accounts", async () => {
    const response = await request(app)
      .get("/api/accounts")
      .expect(200);

    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          name: "Test Checking",
          type: "checking",
          openingBalance: 1000,
        },
        {
          id: 2,
          name: "Test Savings",
          type: "savings",
          openingBalance: 500,
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        pages: 1,
      },
    });
  });


  test("supports pagination query parameters", async () => {
    const response = await request(app)
      .get("/api/accounts?page=2&limit=1")
      .expect(200);

    expect(response.body).toEqual({
      data: [
        {
          id: 2,
          name: "Test Savings",
          type: "savings",
          openingBalance: 500,
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


  test("returns empty data when page exceeds available accounts", async () => {
    const response = await request(app)
      .get("/api/accounts?page=100&limit=10")
      .expect(200);

    expect(response.body.data).toEqual([]);

    expect(response.body.meta).toEqual({
      page: 100,
      limit: 10,
      total: 2,
      pages: 1,
    });
  });


  test("returns validation error for invalid pagination", async () => {
    const response = await request(app)
      .get("/api/accounts?page=0")
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");

    expect(response.body.error.message)
      .toBe("Invalid account data");

    expect(response.body.error.details)
      .toBeDefined();
  });


  test("rejects limit greater than 100", async () => {
    const response = await request(app)
      .get("/api/accounts?limit=101")
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");
  });
});


// ======================================================
// GET /api/accounts/:id
// ======================================================

describe("GET /api/accounts/:id", () => {
  test("returns an existing account", async () => {
    const response = await request(app)
      .get("/api/accounts/1")
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        name: "Test Checking",
        type: "checking",
        openingBalance: 1000,
      },
    });
  });


  test("returns 404 when account does not exist", async () => {
    const response = await request(app)
      .get("/api/accounts/999")
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Account does not exist",
      },
    });
  });


  test("returns 400 for non-numeric id", async () => {
    const response = await request(app)
      .get("/api/accounts/abc")
      .expect(400);

    expect(response.body.error.code)
      .toBe("INVALID_ID");
  });


  test("returns 400 for non-positive id", async () => {
    const response = await request(app)
      .get("/api/accounts/0")
      .expect(400);

    expect(response.body.error.code)
      .toBe("INVALID_ID");
  });
});


// ======================================================
// POST /api/accounts
// ======================================================

describe("POST /api/accounts", () => {
  test("creates an account", async () => {
    const input = {
      name: "Test Cash",
      type: "cash",
      openingBalance: 250.5,
    };

    const response = await request(app)
      .post("/api/accounts")
      .send(input)
      .expect(201);

    expect(response.body).toEqual({
      data: {
        id: 3,
        name: "Test Cash",
        type: "cash",
        openingBalance: 250.5,
      },
    });


    // Verify persistence through the API
    const fetchResponse = await request(app)
      .get("/api/accounts/3")
      .expect(200);

    expect(fetchResponse.body.data)
      .toEqual(response.body.data);
  });


  test("returns validation error for invalid account data", async () => {
    const input = {
      name: "",
      type: "checking",
      openingBalance: 100,
    };

    const response = await request(app)
      .post("/api/accounts")
      .send(input)
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");

    expect(response.body.error.details)
      .toBeDefined();
  });


  test("returns validation error for invalid account type", async () => {
    const input = {
      name: "Invalid Account",
      type: "crypto",
      openingBalance: 100,
    };

    const response = await request(app)
      .post("/api/accounts")
      .send(input)
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");
  });


  test("returns conflict when account already exists", async () => {
    const input = {
      name: "Test Checking",
      type: "checking",
      openingBalance: 1000,
    };

    const response = await request(app)
      .post("/api/accounts")
      .send(input)
      .expect(409);

    expect(response.body).toEqual({
      error: {
        code: "CONFLICT",
        message: "Account already exists",
      },
    });
  });
});


// ======================================================
// PUT /api/accounts/:id
// ======================================================

describe("PUT /api/accounts/:id", () => {
  test("fully replaces an account", async () => {
    const replacement = {
      name: "Updated Account",
      type: "investment",
      openingBalance: 5000,
    };

    const response = await request(app)
      .put("/api/accounts/1")
      .send(replacement)
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        ...replacement,
      },
    });


    const fetchResponse = await request(app)
      .get("/api/accounts/1")
      .expect(200);

    expect(fetchResponse.body.data)
      .toEqual(response.body.data);
  });


  test("returns validation error when PUT is missing required fields", async () => {
    const response = await request(app)
      .put("/api/accounts/1")
      .send({
        name: "Incomplete Account",
      })
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");
  });


  test("returns 404 when replacing nonexistent account", async () => {
    const response = await request(app)
      .put("/api/accounts/999")
      .send({
        name: "Missing Account",
        type: "checking",
        openingBalance: 100,
      })
      .expect(404);

    expect(response.body.error.code)
      .toBe("NOT_FOUND");
  });


  test("returns 400 for invalid id", async () => {
    const response = await request(app)
      .put("/api/accounts/abc")
      .send({
        name: "Account",
        type: "checking",
        openingBalance: 100,
      })
      .expect(400);

    expect(response.body.error.code)
      .toBe("INVALID_ID");
  });
});


// ======================================================
// PATCH /api/accounts/:id
// ======================================================

describe("PATCH /api/accounts/:id", () => {
  test("updates only supplied fields", async () => {
    const response = await request(app)
      .patch("/api/accounts/1")
      .send({
        openingBalance: 1750,
      })
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 1,
        name: "Test Checking",
        type: "checking",
        openingBalance: 1750,
      },
    });
  });


  test("can update multiple fields", async () => {
    const response = await request(app)
      .patch("/api/accounts/2")
      .send({
        name: "Renamed Savings",
        openingBalance: 800,
      })
      .expect(200);

    expect(response.body.data).toEqual({
      id: 2,
      name: "Renamed Savings",
      type: "savings",
      openingBalance: 800,
    });
  });


  test("rejects empty PATCH body", async () => {
    const response = await request(app)
      .patch("/api/accounts/1")
      .send({})
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");
  });


  test("returns validation error for invalid PATCH field", async () => {
    const response = await request(app)
      .patch("/api/accounts/1")
      .send({
        type: "invalid-type",
      })
      .expect(400);

    expect(response.body.error.code)
      .toBe("VALIDATION_ERROR");
  });


  test("returns 404 when patching nonexistent account", async () => {
    const response = await request(app)
      .patch("/api/accounts/999")
      .send({
        openingBalance: 200,
      })
      .expect(404);

    expect(response.body.error.code)
      .toBe("NOT_FOUND");
  });
});


// ======================================================
// DELETE /api/accounts/:id
// ======================================================

describe("DELETE /api/accounts/:id", () => {
  test("deletes and returns the account", async () => {
    const response = await request(app)
      .delete("/api/accounts/2")
      .expect(200);

    expect(response.body).toEqual({
      data: {
        id: 2,
        name: "Test Savings",
        type: "savings",
        openingBalance: 500,
      },
    });


    // Verify it is actually gone
    await request(app)
      .get("/api/accounts/2")
      .expect(404);
  });


  test("returns 404 when deleting nonexistent account", async () => {
    const response = await request(app)
      .delete("/api/accounts/999")
      .expect(404);

    expect(response.body.error.code)
      .toBe("NOT_FOUND");
  });


  test("returns 400 for invalid id", async () => {
    const response = await request(app)
      .delete("/api/accounts/not-an-id")
      .expect(400);

    expect(response.body.error.code)
      .toBe("INVALID_ID");
  });
});