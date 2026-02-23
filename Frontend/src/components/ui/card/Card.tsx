import React from "react";

export type FoodItem = {
  id: string;
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  calories: number;
  protein: number;
  source: string;
  image: string;
  status: "Verified" | "Pending";
};

export const initialFoodItems: FoodItem[] = [
  {
    id: "food-1",
    name: "Burger",
    type: "Lunch",
    calories: 500,
    protein: 18.5,
    source: "AI",
    image: "/images/food/burger.jpeg",
    status: "Pending",
  },
  {
    id: "food-2",
    name: "Salad",
    type: "Dinner",
    calories: 220,
    protein: 6.2,
    source: "USDA",
    image: "/images/food/burger.jpeg",
    status: "Verified",
  },
  {
    id: "food-3",
    name: "Grilled Chicken",
    type: "Dinner",
    calories: 320,
    protein: 31.4,
    source: "WHO",
    image: "/images/food/burger.jpeg",
    status: "Pending",
  },
  {
    id: "food-4",
    name: "Pasta",
    type: "Lunch",
    calories: 410,
    protein: 12.8,
    source: "AI",
    image: "/images/food/burger.jpeg",
    status: "Verified",
  },
  {
    id: "food-5",
    name: "Oatmeal",
    type: "Breakfast",
    calories: 180,
    protein: 5.4,
    source: "USDA",
    image: "/images/food/burger.jpeg",
    status: "Verified",
  },
  {
    id: "food-6",
    name: "Paneer Bowl",
    type: "Dinner",
    calories: 360,
    protein: 19.7,
    source: "NutritionDB",
    image: "/images/food/burger.jpeg",
    status: "Pending",
  },
  {
    id: "food-7",
    name: "Fruit Mix",
    type: "Snacks",
    calories: 140,
    protein: 2.1,
    source: "WHO",
    image: "/images/food/burger.jpeg",
    status: "Verified",
  },
  {
    id: "food-8",
    name: "Egg Sandwich",
    type: "Breakfast",
    calories: 290,
    protein: 15.9,
    source: "AI",
    image: "/images/food/burger.jpeg",
    status: "Pending",
  },
];

type CardProps = {
  items: FoodItem[];
  isEditMode?: boolean;
  selectedIds?: string[];
  onCardClick?: (item: FoodItem) => void;
  onToggleSelect?: (foodId: string, checked: boolean) => void;
};

function Card({
  items,
  isEditMode = false,
  selectedIds = [],
  onCardClick,
  onToggleSelect,
}: CardProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-[10px]">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => !isEditMode && onCardClick?.(item)}
            className={`w-full max-h-[600px] bg-gray-100 rounded-[10px] border-2 transition-all duration-200 ease-out ${
              isEditMode
                ? "border-gray-300"
                : "border-gray-300 hover:scale-105 cursor-pointer"
            } ${
              selectedIds.includes(item.id) ? "ring-2 ring-brand-500 border-brand-500" : ""
            }`}
          >
            <div className="relative justify-center items-center">
              {isEditMode ? (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    onToggleSelect?.(item.id, event.target.checked)
                  }
                  className="absolute top-3 left-3 h-4 w-4 z-10 cursor-pointer"
                  aria-label={`Select ${item.name}`}
                />
              ) : null}
              <img
                className="rounded-t-[8px] w-full h-[200px]"
                src={item.image}
                alt={item.name}
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-[12px] font-semibold rounded-full ${
                  item.status === "Verified"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="ml-[15px] my-[15px]">
              <p className="text-[15px] font-semibold">
                Name: <span className="font-normal ml-[5px]">{item.name}</span>
              </p>
              <p className="text-[15px] font-semibold">
                Type: <span className="font-normal ml-[5px]">{item.type}</span>
              </p>
              <p className="text-[15px] font-semibold">
                Calories:{" "}
                <span className="font-normal ml-[5px]">{item.calories} kCal</span>
              </p>
              <p className="text-[15px] font-semibold">
                Protein:{" "}
                <span className="font-normal ml-[5px]">{item.protein} gm</span>
              </p>
              <p className="text-[15px] font-semibold">
                Source: <span className="font-normal ml-[5px]">{item.source}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Card;
