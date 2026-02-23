import { SubscriptionPlan } from "./subscriptionData";

export const calculateRevenue = (price: number, users: number): number =>
  price * users;

export const calculateActiveSubs = (plans: SubscriptionPlan[]): number =>
  plans.reduce((sum, plan) => sum + plan.users, 0);

const isYearlyPlan = (planName: string): boolean => /year|annual/i.test(planName);

export const calculateMRR = (plans: SubscriptionPlan[]): number =>
  plans.reduce((sum, plan) => {
    const planRevenue = calculateRevenue(plan.price, plan.users);
    if (isYearlyPlan(plan.planName)) {
      return sum + planRevenue / 12;
    }
    return sum + planRevenue;
  }, 0);

export const formatINR = (value: number): string =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value)}`;

export const formatINRCompactLakh = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 100000) {
    const lakhValue = (value / 100000).toFixed(1).replace(/\.0$/, "");
    return `₹${lakhValue}L`;
  }

  if (absValue >= 1000) {
    const thousandValue = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `₹${thousandValue}K`;
  }

  return formatINR(value);
};
