import request from "supertest";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import app from "../../app.js";
import { getAccounts, setAccounts } from "../../datastore/accountsData.js";
import getMaxId from "../utils/getMaxId.js";
import type { CreateAccountInput } from "../../types/accountTypes/accountsSchemaType.js";
import { AccountType } from "../../types/accountTypes/accountType.js";

describe("Account controller test suite", () => {
  const originalAccounts = structuredClone(getAccounts());

  beforeEach(() => {
    setAccounts(structuredClone(originalAccounts));
  });

  describe("GET /api/accounts", () => {
    it("Should return paginated accounts", async () => {
    const accounts = getAccounts();

    const result = await request(app).get(
      "/api/accounts?page=1&limit=2",
    );

    assert.strictEqual(result.statusCode, 200);

    assert.strictEqual(result.body.page, 1);
    assert.strictEqual(result.body.limit, 2);
    assert.strictEqual(
      result.body.totalAccounts,
      accounts.length,
    );
    assert.strictEqual(
      result.body.pages,
      Math.ceil(accounts.length / 2),
    );

    assert.deepStrictEqual(
      result.body.data,
      accounts.slice(0, 2),
    );
  });

    it("Should return the second page of accounts", async () => {
        const accounts = getAccounts();

        const result = await request(app).get(
        "/api/accounts?page=2&limit=2",
        );

        assert.strictEqual(result.statusCode, 200);
        assert.strictEqual(result.body.page, 2);
        assert.strictEqual(result.body.limit, 2);

        assert.deepStrictEqual(
        result.body.data,
        accounts.slice(2, 4),
        );
    });

    it("Should return an empty data array when page exceeds available accounts", async () => {
        const result = await request(app).get(
        "/api/accounts?page=100&limit=10",
        );

        assert.strictEqual(result.statusCode, 200);
        assert.deepStrictEqual(result.body.data, []);
    });

    it("Should return 400 when page is invalid", async () => {
        const result = await request(app).get(
        "/api/accounts?page=0&limit=10",
        );

        assert.strictEqual(result.statusCode, 400);
        assert.strictEqual(
        result.body.error,
        "Invalid query parameters",
        );
    });

    it("Should return 400 when limit is invalid", async () => {
        const result = await request(app).get(
        "/api/accounts?page=1&limit=0",
        );

        assert.strictEqual(result.statusCode, 400);
    });

    it("Should return 400 when pagination parameters are not numeric", async () => {
        const result = await request(app).get(
        "/api/accounts?page=test&limit=test",
        );

        assert.strictEqual(result.statusCode, 400);
    });

    it("Should use default pagination when query parameters are omitted", async () => {
        const accounts = getAccounts();

        const result = await request(app).get("/api/accounts");

        assert.strictEqual(result.statusCode, 200);
        assert.strictEqual(result.body.page, 1);
        assert.strictEqual(result.body.limit, 10);
        assert.strictEqual(result.body.totalAccounts, accounts.length);

        assert.deepStrictEqual(
            result.body.data,
            accounts.slice(0, 10),
        );
    });
  });

  // GET individual account
  describe("GET /api/accounts/:id", () => {
  it("Should return an account", async () => {
    const accounts = getAccounts();
    const currentMaxId = getMaxId(accounts);

    const expectedResult = accounts.find(
      (account) => account.id === currentMaxId,
    );

    const result = await request(app).get(
      `/api/accounts/${currentMaxId}`,
    );

    assert.strictEqual(result.statusCode, 200);
    assert.deepStrictEqual(result.body, expectedResult);
  });

  it("Should return a 404 on invalid request", async () => {
    const accounts = getAccounts();
    const currentMaxId = getMaxId(accounts);

    const result = await request(app).get(
      `/api/accounts/${currentMaxId + 1}`,
    );

    assert.strictEqual(result.statusCode, 404);
  });
});

  // POST
  describe("POST /api/accounts", () => {
    it("Should create an account", async () => {
      const accountsBefore = getAccounts();
      const previousMaxId = getMaxId(accountsBefore);

      const accountInput: CreateAccountInput = {
        name: "Test Savings",
        type: AccountType.Savings,
        balance: 1500,
      };

      const result = await request(app)
        .post("/api/accounts")
        .send(accountInput);

      assert.strictEqual(result.statusCode, 201);

      assert.strictEqual(result.body.id, previousMaxId + 1);

      assert.strictEqual(result.body.name, accountInput.name);

      assert.strictEqual(result.body.type, accountInput.type);

      assert.strictEqual(result.body.balance, accountInput.balance);

      const storedAccount = getAccounts().find(
        (account) => account.id === result.body.id,
      );

      assert.ok(storedAccount);
      assert.deepStrictEqual(storedAccount, result.body);
    });

    it("Should return 400 for invalid account data", async () => {
      const invalidAccount = {
        name: "",
        type: AccountType.Savings,
        balance: 1000,
      };

      const result = await request(app)
        .post("/api/accounts")
        .send(invalidAccount);

      assert.strictEqual(result.statusCode, 400);
      assert.strictEqual(result.body.error, "invalid account data");
    });

    it("Should not create an account when validation fails", async () => {
      const accountsBefore = structuredClone(getAccounts());

      const result = await request(app).post("/api/accounts").send({
        name: "",
        type: "invalid-type",
        balance: "not-a-number",
      });

      assert.strictEqual(result.statusCode, 400);
      assert.deepStrictEqual(getAccounts(), accountsBefore);
    });
  });

  // PUT
  describe("PUT /api/accounts/:id", () => {
    it("Should replace an existing account", async () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const replacement: CreateAccountInput = {
        name: "Replacement Account",
        type: AccountType.Cash,
        balance: 750,
      };

      const result = await request(app)
        .put(`/api/accounts/${account.id}`)
        .send(replacement);

      assert.strictEqual(result.statusCode, 200);

      assert.deepStrictEqual(result.body, {
        id: account.id,
        ...replacement,
      });

      const storedAccount = getAccounts().find(
        (stored) => stored.id === account.id,
      );

      assert.deepStrictEqual(storedAccount, result.body);
    });

    it("Should return 400 for invalid replacement data", async () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const result = await request(app)
        .put(`/api/accounts/${account.id}`)
        .send({
          name: "",
          type: AccountType.Cash,
          balance: 500,
        });

      assert.strictEqual(result.statusCode, 400);
    });

    it("Should return 404 when replacing nonexistent account", async () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);

      const replacement: CreateAccountInput = {
        name: "Replacement",
        type: AccountType.Checking,
        balance: 500,
      };

      const result = await request(app)
        .put(`/api/accounts/${currentMaxId + 1}`)
        .send(replacement);

      assert.strictEqual(result.statusCode, 404);
    });
  });

  // PATCH
  describe("PATCH /api/accounts/:id", () => {
    it("Should partially update an account", async () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const result = await request(app)
        .patch(`/api/accounts/${account.id}`)
        .send({
          balance: 5000,
        });

      assert.strictEqual(result.statusCode, 200);

      assert.strictEqual(result.body.id, account.id);

      assert.strictEqual(result.body.balance, 5000);

      // Fields omitted from PATCH should remain unchanged
      assert.strictEqual(result.body.name, account.name);

      assert.strictEqual(result.body.type, account.type);

      const storedAccount = getAccounts().find(
        (stored) => stored.id === account.id,
      );

      assert.deepStrictEqual(storedAccount, result.body);
    });

    it("Should return 400 for invalid patch data", async () => {
      const accounts = getAccounts();
      const account = accounts[0];

      assert.ok(account);

      const result = await request(app)
        .patch(`/api/accounts/${account.id}`)
        .send({
          balance: "invalid balance",
        });

      assert.strictEqual(result.statusCode, 400);
    });

    it("Should return 404 when patching nonexistent account", async () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);

      const result = await request(app)
        .patch(`/api/accounts/${currentMaxId + 1}`)
        .send({
          balance: 500,
        });

      assert.strictEqual(result.statusCode, 404);
    });
  });

  // DELETE
  describe("DELETE /api/accounts/:id", () => {
    it("Should delete an existing account", async () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);

      const result = await request(app).delete(`/api/accounts/${currentMaxId}`);

      assert.strictEqual(result.statusCode, 200);

      const deletedAccount = getAccounts().find(
        (account) => account.id === currentMaxId,
      );

      assert.strictEqual(deletedAccount, undefined);
    });

    it("Should return 404 when deleting nonexistent account", async () => {
      const accounts = getAccounts();
      const currentMaxId = getMaxId(accounts);

      const result = await request(app).delete(
        `/api/accounts/${currentMaxId + 1}`,
      );

      assert.strictEqual(result.statusCode, 404);
    });
  });
});
