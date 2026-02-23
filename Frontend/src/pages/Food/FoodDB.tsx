import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Food from "../../components/common/Food";
import Card, { FoodItem, initialFoodItems } from "../../components/ui/card/Card";
import Button from "../../components/ui/button/Button";
import ScrollReveal from "../../components/common/ScrollReveal";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hook/useModal";

type AddFoodFormState = {
  name: string;
  type: FoodItem["type"];
  calories: string;
  protein: string;
  source: string;
  image: string;
};

function FoodDB() {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoodItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFoodIds, setSelectedFoodIds] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [editFood, setEditFood] = useState<FoodItem | null>(null);
  const [addFoodForm, setAddFoodForm] = useState<AddFoodFormState>({
    name: "",
    type: "Breakfast",
    calories: "",
    protein: "",
    source: "",
    image: "/images/food/burger.jpeg",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [foodFilters, setFoodFilters] = useState({
    type: "All Foods",
    source: "All Sources",
    status: "All Status",
  });
  const { isOpen: isDetailsOpen, openModal: openDetails, closeModal: closeDetails } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const { isOpen: isAddOpen, openModal: openAdd, closeModal: closeAdd } = useModal();

  const handleCardClick = (food: FoodItem) => {
    setSelectedFood(food);
    openDetails();
  };

  const handleOpenEditFood = () => {
    if (!selectedFood) return;
    setEditFood(selectedFood);
    closeDetails();
    openEdit();
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editFood) return;
    setFoods((prev) =>
      prev.map((food) => (food.id === editFood.id ? editFood : food))
    );
    setSelectedFood(editFood);
    closeEdit();
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) setSelectedFoodIds([]);
      return next;
    });
  };

  const handleToggleSelect = (foodId: string, checked: boolean) => {
    setSelectedFoodIds((prev) => {
      if (checked) return [...prev, foodId];
      return prev.filter((id) => id !== foodId);
    });
  };

  const handleDeleteSelected = () => {
    if (selectedFoodIds.length === 0) return;
    setFoods((prev) => prev.filter((food) => !selectedFoodIds.includes(food.id)));
    setSelectedFoodIds([]);
  };

  const handleOpenAddFood = () => {
    setAddFoodForm({
      name: "",
      type: "Breakfast",
      calories: "",
      protein: "",
      source: "",
      image: "/images/food/burger.jpeg",
    });
    openAdd();
  };

  const handleAddFoodSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !addFoodForm.name.trim() ||
      !addFoodForm.source.trim() ||
      Number(addFoodForm.calories) < 0 ||
      Number(addFoodForm.protein) < 0
    ) {
      return;
    }

    const nextFood: FoodItem = {
      id: `food-${Date.now()}`,
      name: addFoodForm.name.trim(),
      type: addFoodForm.type,
      calories: Number(addFoodForm.calories),
      protein: Number(addFoodForm.protein),
      source: addFoodForm.source.trim(),
      image: addFoodForm.image.trim() || "/images/food/burger.jpeg",
      status: "Pending",
    };
    setFoods((prev) => [nextFood, ...prev]);
    closeAdd();
  };

  const handleApprove = () => {
    setFoods((prev) => {
      if (selectedFoodIds.length > 0) {
        return prev.map((food) =>
          selectedFoodIds.includes(food.id) ? { ...food, status: "Verified" } : food
        );
      }
      return prev.map((food) =>
        food.status === "Pending" ? { ...food, status: "Verified" } : food
      );
    });
    setSelectedFoodIds([]);
  };

  const filteredFoods = foods.filter((food) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      food.name.toLowerCase().includes(search) ||
      food.source.toLowerCase().includes(search) ||
      food.type.toLowerCase().includes(search);
    const matchesType =
      foodFilters.type === "All Foods" || food.type === foodFilters.type;
    const matchesSource =
      foodFilters.source === "All Sources" || food.source === foodFilters.source;
    const matchesStatus =
      foodFilters.status === "All Status" || food.status === foodFilters.status;
    return matchesSearch && matchesType && matchesSource && matchesStatus;
  });

  return (
    <>
      <PageMeta
        title="Food DB"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <ScrollReveal delay={0.2} origin="left" className="relative z-40">
        <Food
          onSearchChange={setSearchTerm}
          onDropdownChange={(id, value) =>
            setFoodFilters((prev) => ({ ...prev, [id]: value }))
          }
        />
      </ScrollReveal>
      <ScrollReveal origin="right" className="relative z-10">
        <div className="w-full border-2 border-gray-200 mt-[20px] rounded-2xl hover:shadow-xl">
          <Card
            items={filteredFoods}
            isEditMode={isEditMode}
            selectedIds={selectedFoodIds}
            onCardClick={handleCardClick}
            onToggleSelect={handleToggleSelect}
          />
        </div>
      </ScrollReveal>
      <ScrollReveal origin="top" className="relative z-10">
        <div className="m-[10px] gap-3 flex justify-end">
          <Button onClick={handleOpenAddFood}>Add Food</Button>
          <Button onClick={toggleEditMode}>{isEditMode ? "Done" : "Edit"}</Button>
          <Button
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
            onClick={handleDeleteSelected}
            disabled={selectedFoodIds.length === 0}
          >
            Delete
          </Button>
          <Button className="bg-green-500 hover:bg-green-600" onClick={handleApprove}>
            Approve
          </Button>
        </div>
      </ScrollReveal>

      <Modal isOpen={isDetailsOpen} onClose={closeDetails} className="max-w-[520px] m-4 p-6">
        {selectedFood ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedFood.name}</h2>
            <img
              src={selectedFood.image}
              alt={selectedFood.name}
              className="mt-4 h-56 w-full rounded-xl object-cover"
            />
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Calories:</span> {selectedFood.calories} kCal
              </p>
              <p>
                <span className="font-semibold">Type:</span> {selectedFood.type}
              </p>
              <p>
                <span className="font-semibold">Protein:</span> {selectedFood.protein} gm
              </p>
              <p>
                <span className="font-semibold">Source:</span> {selectedFood.source}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {selectedFood.status}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={closeDetails}>
                Close
              </Button>
              <Button onClick={handleOpenEditFood}>Edit</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEdit} className="max-w-[560px] m-4 p-6">
        {editFood ? (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Food</h2>
            <div>
              <label htmlFor="food-name" className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="food-name"
                type="text"
                value={editFood.name}
                onChange={(event) =>
                  setEditFood((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="food-type" className="mb-1 block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="food-type"
                value={editFood.type}
                onChange={(event) =>
                  setEditFood((prev) =>
                    prev
                      ? { ...prev, type: event.target.value as FoodItem["type"] }
                      : prev
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="food-calories" className="mb-1 block text-sm font-medium text-gray-700">
                  Calories
                </label>
                <input
                  id="food-calories"
                  type="number"
                  min={0}
                  value={editFood.calories}
                  onChange={(event) =>
                    setEditFood((prev) =>
                      prev ? { ...prev, calories: Number(event.target.value) } : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label htmlFor="food-protein" className="mb-1 block text-sm font-medium text-gray-700">
                  Protein
                </label>
                <input
                  id="food-protein"
                  type="number"
                  min={0}
                  step="0.1"
                  value={editFood.protein}
                  onChange={(event) =>
                    setEditFood((prev) =>
                      prev ? { ...prev, protein: Number(event.target.value) } : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="food-source" className="mb-1 block text-sm font-medium text-gray-700">
                  Source
                </label>
                <input
                  id="food-source"
                  type="text"
                  value={editFood.source}
                  onChange={(event) =>
                    setEditFood((prev) => (prev ? { ...prev, source: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label htmlFor="food-status" className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="food-status"
                  value={editFood.status}
                  onChange={(event) =>
                    setEditFood((prev) =>
                      prev
                        ? { ...prev, status: event.target.value as FoodItem["status"] }
                        : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeEdit}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal isOpen={isAddOpen} onClose={closeAdd} className="max-w-[560px] m-4 p-6">
        <form onSubmit={handleAddFoodSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Add Food</h2>
          <div>
            <label htmlFor="add-food-name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="add-food-name"
              type="text"
              required
              value={addFoodForm.name}
              onChange={(event) =>
                setAddFoodForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label htmlFor="add-food-type" className="mb-1 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="add-food-type"
              value={addFoodForm.type}
              onChange={(event) =>
                setAddFoodForm((prev) => ({
                  ...prev,
                  type: event.target.value as FoodItem["type"],
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-food-calories" className="mb-1 block text-sm font-medium text-gray-700">
                Calories
              </label>
              <input
                id="add-food-calories"
                type="number"
                min={0}
                required
                value={addFoodForm.calories}
                onChange={(event) =>
                  setAddFoodForm((prev) => ({ ...prev, calories: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="add-food-protein" className="mb-1 block text-sm font-medium text-gray-700">
                Protein
              </label>
              <input
                id="add-food-protein"
                type="number"
                min={0}
                step="0.1"
                required
                value={addFoodForm.protein}
                onChange={(event) =>
                  setAddFoodForm((prev) => ({ ...prev, protein: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-food-source" className="mb-1 block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                id="add-food-source"
                type="text"
                required
                value={addFoodForm.source}
                onChange={(event) =>
                  setAddFoodForm((prev) => ({ ...prev, source: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="add-food-image" className="mb-1 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                id="add-food-image"
                type="text"
                value={addFoodForm.image}
                onChange={(event) =>
                  setAddFoodForm((prev) => ({ ...prev, image: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeAdd}>
              Cancel
            </Button>
            <Button type="submit">Add Food</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default FoodDB;
