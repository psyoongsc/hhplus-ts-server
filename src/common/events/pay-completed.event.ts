import { Order } from "@prisma/client";

export class PayCompletedEvent {
  constructor (
    public readonly order: Order
  ) {}
}