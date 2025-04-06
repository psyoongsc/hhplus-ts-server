import { OrderStatus } from "./order-status.enum";

export class OrderResult {
  id: number;
  memberId: number;
  couponId: number;
  totalSales: number;
  discountedSales: number;
  status: OrderStatus;
}
