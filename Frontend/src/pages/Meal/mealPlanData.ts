export type MealItem = {
  id: string;
  label: string;
  icon: string;
  foods: string;
};

export type FixedMealSlots = {
  breakfastFood: string;
  lunchFood: string;
  dinnerFood: string;
  snacksFood: string;
};

export type MealPlanRow = {
  planName: string;
  caloriesPerDay: number;
  assignedUsers: number;
  mealItems: MealItem[];
};

export const formatCalories = (kcal: number): string => `${kcal} kcal / day`;

export const formatAssignedUsers = (count: number): string =>
  new Intl.NumberFormat("en-US").format(count);

export const normalizePlanName = (name: string): string =>
  name.trim().replace(/\s+/g, " ");

export const createMealItemsFromFixedSlots = (
  values: FixedMealSlots
): MealItem[] => [
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "🍳",
    foods: values.breakfastFood.trim(),
  },
  {
    id: "lunch",
    label: "Lunch",
    icon: "🍛",
    foods: values.lunchFood.trim(),
  },
  {
    id: "dinner",
    label: "Dinner",
    icon: "🥗",
    foods: values.dinnerFood.trim(),
  },
  {
    id: "snacks",
    label: "Snacks",
    icon: "🍎",
    foods: values.snacksFood.trim(),
  },
];

export const isPlanNameTaken = (
  name: string,
  plans: MealPlanRow[],
  excludeName?: string
): boolean => {
  const normalizedName = normalizePlanName(name).toLowerCase();
  const normalizedExclude = excludeName?.toLowerCase();
  return plans.some((plan) => {
    const current = plan.planName.toLowerCase();
    if (normalizedExclude && current === normalizedExclude) return false;
    return current === normalizedName;
  });
};

export const mealPlanRows: MealPlanRow[] = [
  {
    planName: "Weight Loss",
    caloriesPerDay: 1600,
    assignedUsers: 2140,
    mealItems: [
      { id: "breakfast", label: "Breakfast", icon: "🍳", foods: "Oats + Fruits" },
      { id: "lunch", label: "Lunch", icon: "🍛", foods: "Rice + Dal" },
      { id: "dinner", label: "Dinner", icon: "🥗", foods: "Salad + Paneer" },
      { id: "snacks", label: "Snacks", icon: "🍎", foods: "Nuts" },
    ],
  },
  {
    planName: "Muscle Gain",
    caloriesPerDay: 2600,
    assignedUsers: 1240,
    mealItems: [
      { id: "breakfast", label: "Breakfast", icon: "🍳", foods: "Eggs + Toast" },
      { id: "lunch", label: "Lunch", icon: "🍛", foods: "Chicken + Rice" },
      { id: "dinner", label: "Dinner", icon: "🥗", foods: "Salmon + Quinoa" },
      { id: "snacks", label: "Snacks", icon: "🍎", foods: "Greek Yogurt + Nuts" },
    ],
  },
  {
    planName: "Keto",
    caloriesPerDay: 1800,
    assignedUsers: 760,
    mealItems: [
      { id: "breakfast", label: "Breakfast", icon: "🍳", foods: "Avocado + Eggs" },
      { id: "lunch", label: "Lunch", icon: "🍛", foods: "Grilled Chicken Salad" },
      { id: "dinner", label: "Dinner", icon: "🥗", foods: "Paneer Stir-fry" },
      { id: "snacks", label: "Snacks", icon: "🍎", foods: "Almonds" },
    ],
  },
  {
    planName: "Vegan",
    caloriesPerDay: 1900,
    assignedUsers: 980,
    mealItems: [
      { id: "breakfast", label: "Breakfast", icon: "🍳", foods: "Smoothie Bowl" },
      { id: "lunch", label: "Lunch", icon: "🍛", foods: "Chickpea Curry + Rice" },
      { id: "dinner", label: "Dinner", icon: "🥗", foods: "Tofu Salad Wrap" },
      { id: "snacks", label: "Snacks", icon: "🍎", foods: "Trail Mix" },
    ],
  },
  
];

export const findMealPlanByName = (planName: string): MealPlanRow | undefined =>
  mealPlanRows.find((row) => row.planName === planName);
