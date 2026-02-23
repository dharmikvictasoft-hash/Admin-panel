export type SubscriptionPlan = {
  id: string;
  planName: string;
  price: number;
  users: number;
};

export const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "sub-monthly",
    planName: "Monthly",
    price: 399,
    users: 1420,
  },
  {
    id: "sub-yearly",
    planName: "Yearly",
    price: 2999,
    users: 720,
  },
];
