// utils/calculateCalories.js
export const calculateCaloriesFromSteps = (steps, weight) => {
  return steps * weight * 0.0005;
};
