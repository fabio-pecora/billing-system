export type Customer = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  status: string;
  created_at?: string;
};