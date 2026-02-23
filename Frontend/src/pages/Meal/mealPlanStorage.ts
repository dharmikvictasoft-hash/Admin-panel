import { MealPlanRow, mealPlanRows } from "./mealPlanData";

export const MEAL_PLANS_STORAGE_KEY = "meal_plans_v1";

const isMealItem = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.icon === "string" &&
    typeof item.foods === "string"
  );
};

const isMealPlanRow = (value: unknown): value is MealPlanRow => {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.planName === "string" &&
    typeof row.caloriesPerDay === "number" &&
    typeof row.assignedUsers === "number" &&
    Array.isArray(row.mealItems) &&
    row.mealItems.every(isMealItem)
  );
};

const cloneDefaultPlans = (): MealPlanRow[] => mealPlanRows.map((plan) => ({ ...plan, mealItems: [...plan.mealItems] }));

export const saveMealPlans = (plans: MealPlanRow[]): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEAL_PLANS_STORAGE_KEY, JSON.stringify(plans));
  } catch {
    // Ignore storage write failures (e.g., private mode/quota).
  }
};

export const loadMealPlans = (): MealPlanRow[] => {
  if (typeof window === "undefined") return cloneDefaultPlans();
  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const isReload = navigationEntry?.type === "reload";
  if (isReload) {
    const defaults = cloneDefaultPlans();
    saveMealPlans(defaults);
    return defaults;
  }
  try {
    const raw = window.localStorage.getItem(MEAL_PLANS_STORAGE_KEY);
    if (!raw) return cloneDefaultPlans();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isMealPlanRow)) {
      return parsed;
    }
  } catch {
    // Ignore and fallback to defaults.
  }

  const defaults = cloneDefaultPlans();
  saveMealPlans(defaults);
  return defaults;
};
