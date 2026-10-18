import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PaidOrderEvent } from "./payments/types";

/**
 * Minimal file-based order ledger (development / single-server demo).
 * It records PAID orders (written only from the signature-verified webhook), makes that write
 * idempotent per payment session, and lets checkout subtract sold units from catalog stock.
 * On serverless or multi-instance hosting replace this module with a real database.
 */
const FILE = path.join(process.cwd(), ".data", "orders.json");

interface Ledger {
  orders: (PaidOrderEvent & { recordedAt: string })[];
}

async function read(): Promise<Ledger> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Ledger;
  } catch {
    return { orders: [] };
  }
}

export async function recordPaidOrder(event: PaidOrderEvent): Promise<"recorded" | "duplicate"> {
  const ledger = await read();
  if (ledger.orders.some((o) => o.sessionId === event.sessionId)) return "duplicate";
  ledger.orders.push({ ...event, recordedAt: new Date().toISOString() });
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(ledger, null, 2));
  return "recorded";
}

/** Units already sold per `${productId}|${size}` according to paid orders. */
export async function soldUnits(): Promise<Map<string, number>> {
  const sold = new Map<string, number>();
  for (const order of (await read()).orders) {
    for (const i of order.items) {
      const key = `${i.productId}|${i.size}`;
      sold.set(key, (sold.get(key) ?? 0) + i.quantity);
    }
  }
  return sold;
}
