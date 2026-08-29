import { POST as createOrderHandler } from '../create-order/route';

export async function POST(req: Request) {
  return createOrderHandler(req);
}
