CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"balance" numeric(12,2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY,
	"accountId" integer NOT NULL,
	"destinationAccountId" integer,
	"amount" numeric(12,2) NOT NULL,
	"description" varchar(255),
	"date" date DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destinationAccountId_accounts_id_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "accounts"("id");