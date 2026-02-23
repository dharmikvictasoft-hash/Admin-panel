import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hook/useModal";
import {
  FixedMealSlots,
  MealPlanRow,
  createMealItemsFromFixedSlots,
  formatAssignedUsers,
  formatCalories,
  isPlanNameTaken,
  normalizePlanName,
} from "./mealPlanData";
import { loadMealPlans, saveMealPlans } from "./mealPlanStorage";

type ViewMode = "split" | "classic";
type CreateEditMode = "create" | "edit";
type CreateModalSource = "list_add" | "details" | null;

type CreateEditFormState = {
  planName: string;
  caloriesPerDay: string;
} & FixedMealSlots;

type CreateEditErrors = Partial<Record<keyof CreateEditFormState, string>>;

const getNextPlanAfterDelete = (
  currentPlans: MealPlanRow[],
  deletingPlanName: string
): MealPlanRow | undefined => {
  const deletingIndex = currentPlans.findIndex(
    (plan) => plan.planName === deletingPlanName
  );
  if (deletingIndex === -1) return currentPlans[0];
  const remainingPlans = currentPlans.filter(
    (plan) => plan.planName !== deletingPlanName
  );
  if (remainingPlans.length === 0) return undefined;
  if (deletingIndex < remainingPlans.length) return remainingPlans[deletingIndex];
  return remainingPlans[remainingPlans.length - 1];
};

function MealPlanDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planName = "" } = useParams();
  const decodedPlanName = decodeURIComponent(planName);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [plans, setPlans] = useState<MealPlanRow[]>(() => loadMealPlans());

  const {
    isOpen: isCreateEditOpen,
    openModal: openCreateEditModal,
    closeModal: closeCreateEditModal,
  } = useModal();
  const {
    isOpen: isAssignOpen,
    openModal: openAssignModal,
    closeModal: closeAssignModal,
  } = useModal();
  const {
    isOpen: isDeleteConfirmOpen,
    openModal: openDeleteConfirmModal,
    closeModal: closeDeleteConfirmModal,
  } = useModal();

  const [createEditMode, setCreateEditMode] = useState<CreateEditMode>("create");
  const [editingOriginalName, setEditingOriginalName] = useState("");
  const [createEditForm, setCreateEditForm] = useState<CreateEditFormState>({
    planName: "",
    caloriesPerDay: "",
    breakfastFood: "",
    lunchFood: "",
    dinnerFood: "",
    snacksFood: "",
  });
  const [createEditErrors, setCreateEditErrors] = useState<CreateEditErrors>({});
  const [createModalSource, setCreateModalSource] =
    useState<CreateModalSource>(null);
  const [assignUsersValue, setAssignUsersValue] = useState("");
  const [assignError, setAssignError] = useState("");
  const planNameInputRef = useRef<HTMLInputElement>(null);
  const assignInputRef = useRef<HTMLInputElement>(null);

  const fallbackPlan = plans[0];
  const selectedMealPlan = useMemo(() => {
    const selected = plans.find((row) => row.planName === decodedPlanName);
    return selected ?? fallbackPlan;
  }, [decodedPlanName, fallbackPlan, plans]);

  useEffect(() => {
    if (!fallbackPlan) return;
    const isValid = plans.some((row) => row.planName === decodedPlanName);
    if (!decodedPlanName || isValid) return;
    navigate(`/meals/${encodeURIComponent(fallbackPlan.planName)}`, { replace: true });
  }, [decodedPlanName, fallbackPlan, navigate, plans]);

  useEffect(() => {
    saveMealPlans(plans);
  }, [plans]);

  useEffect(() => {
    if (isCreateEditOpen) {
      setTimeout(() => planNameInputRef.current?.focus(), 0);
    }
  }, [isCreateEditOpen]);

  useEffect(() => {
    if (isAssignOpen) {
      setTimeout(() => assignInputRef.current?.focus(), 0);
    }
  }, [isAssignOpen]);

  useEffect(() => {
    const routeState = (location.state as
      | { openCreateModal?: boolean; createModalSource?: CreateModalSource }
      | null
      | undefined);
    if (!routeState?.openCreateModal) return;
    openCreatePlanModal(routeState.createModalSource ?? "details");
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const openCreatePlanModal = (source: CreateModalSource = "details") => {
    setCreateEditMode("create");
    setEditingOriginalName("");
    setCreateModalSource(source);
    setCreateEditForm({
      planName: "",
      caloriesPerDay: "",
      breakfastFood: "",
      lunchFood: "",
      dinnerFood: "",
      snacksFood: "",
    });
    setCreateEditErrors({});
    openCreateEditModal();
  };

  const handleCloseCreateEditModal = () => {
    const shouldRedirectToList =
      createEditMode === "create" && createModalSource === "list_add";
    closeCreateEditModal();
    setCreateModalSource(null);
    if (shouldRedirectToList) {
      navigate("/meals");
    }
  };

  const openEditPlanModal = () => {
    if (!selectedMealPlan) return;
    setCreateEditMode("edit");
    setEditingOriginalName(selectedMealPlan.planName);
    setCreateEditForm({
      planName: selectedMealPlan.planName,
      caloriesPerDay: String(selectedMealPlan.caloriesPerDay),
      breakfastFood:
        selectedMealPlan.mealItems.find((item) => item.id === "breakfast")?.foods ?? "",
      lunchFood:
        selectedMealPlan.mealItems.find((item) => item.id === "lunch")?.foods ?? "",
      dinnerFood:
        selectedMealPlan.mealItems.find((item) => item.id === "dinner")?.foods ?? "",
      snacksFood:
        selectedMealPlan.mealItems.find((item) => item.id === "snacks")?.foods ?? "",
    });
    setCreateEditErrors({});
    openCreateEditModal();
  };

  const openAssignUsersModal = () => {
    if (!selectedMealPlan) return;
    setAssignUsersValue(String(selectedMealPlan.assignedUsers));
    setAssignError("");
    openAssignModal();
  };

  const handleCreateEditChange = (
    key: keyof CreateEditFormState,
    value: string
  ) => {
    setCreateEditForm((prev) => ({ ...prev, [key]: value }));
    setCreateEditErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateCreateEditForm = (): boolean => {
    const errors: CreateEditErrors = {};
    const normalizedPlanName = normalizePlanName(createEditForm.planName);
    if (normalizedPlanName.length < 2) {
      errors.planName = "Plan name must be at least 2 characters.";
    } else if (
      isPlanNameTaken(normalizedPlanName, plans, createEditMode === "edit" ? editingOriginalName : undefined)
    ) {
      errors.planName = "A plan with this name already exists.";
    }

    const calories = Number(createEditForm.caloriesPerDay);
    if (!Number.isInteger(calories) || calories <= 0) {
      errors.caloriesPerDay = "Calories must be a positive whole number.";
    }

    if (!createEditForm.breakfastFood.trim()) errors.breakfastFood = "Breakfast meal is required.";
    if (!createEditForm.lunchFood.trim()) errors.lunchFood = "Lunch meal is required.";
    if (!createEditForm.dinnerFood.trim()) errors.dinnerFood = "Dinner meal is required.";
    if (!createEditForm.snacksFood.trim()) errors.snacksFood = "Snacks meal is required.";

    setCreateEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCreateEditForm()) return;

    const normalizedPlanName = normalizePlanName(createEditForm.planName);
    const caloriesPerDay = Number(createEditForm.caloriesPerDay);
    const nextPlan: MealPlanRow = {
      planName: normalizedPlanName,
      caloriesPerDay,
      assignedUsers: createEditMode === "create" ? 0 : selectedMealPlan?.assignedUsers ?? 0,
      mealItems: createMealItemsFromFixedSlots({
        breakfastFood: createEditForm.breakfastFood,
        lunchFood: createEditForm.lunchFood,
        dinnerFood: createEditForm.dinnerFood,
        snacksFood: createEditForm.snacksFood,
      }),
    };

    if (createEditMode === "create") {
      setPlans((prev) => [...prev, nextPlan]);
      const source = createModalSource;
      setCreateModalSource(null);
      closeCreateEditModal();
      if (source === "list_add") {
        navigate("/meals", { state: { createdPlan: nextPlan } });
      }
      return;
    }

    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.planName !== editingOriginalName) return plan;
        return { ...nextPlan, assignedUsers: plan.assignedUsers };
      })
    );
    closeCreateEditModal();
    if (editingOriginalName !== nextPlan.planName) {
      navigate(`/meals/${encodeURIComponent(nextPlan.planName)}`);
    }
  };

  const handleAssignUsersSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUsers = Number(assignUsersValue);
    if (!Number.isInteger(nextUsers) || nextUsers < 0) {
      setAssignError("Assigned users must be a non-negative whole number.");
      return;
    }
    if (!selectedMealPlan) return;
    setPlans((prev) =>
      prev.map((plan) =>
        plan.planName === selectedMealPlan.planName
          ? { ...plan, assignedUsers: nextUsers }
          : plan
      )
    );
    closeAssignModal();
  };

  const handleOpenDeleteConfirm = () => {
    if (createEditMode !== "edit" || !editingOriginalName) return;
    openDeleteConfirmModal();
  };

  const handleDeletePlan = () => {
    if (createEditMode !== "edit" || !editingOriginalName) return;
    const nextPlan = getNextPlanAfterDelete(plans, editingOriginalName);
    setPlans((prev) =>
      prev.filter((plan) => plan.planName !== editingOriginalName)
    );
    closeDeleteConfirmModal();
    closeCreateEditModal();
    if (nextPlan) {
      navigate(`/meals/${encodeURIComponent(nextPlan.planName)}`);
    }
  };

  if (!selectedMealPlan) {
    return (
      <div className="p-4 sm:p-6">
        <PageMeta title="Meal Plans" description="Meal plan details page" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
          No meal plans available.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <PageMeta
        title={`${selectedMealPlan.planName} | Meal Plan`}
        description="Meal plan details page"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Meal Plans
        </h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium sm:text-sm ${
                viewMode === "split"
                  ? "bg-brand-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode("classic")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium sm:text-sm ${
                viewMode === "classic"
                  ? "bg-brand-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Classic
            </button>
          </div>
          <Button onClick={() => openCreatePlanModal("details")}>+ Create Plan</Button>
        </div>
      </div>

      {viewMode === "split" ? (
        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <aside className="border-b border-gray-200 p-4 md:border-b-0 md:border-r">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">Plans</h2>
              <div className="space-y-2">
                {plans.map((plan) => {
                  const isActive = plan.planName === selectedMealPlan.planName;
                  return (
                    <button
                      key={plan.planName}
                      type="button"
                      onClick={() =>
                        navigate(`/meals/${encodeURIComponent(plan.planName)}`)
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                        isActive
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {plan.planName}
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedMealPlan.planName}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {formatCalories(selectedMealPlan.caloriesPerDay)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span>🍽 {selectedMealPlan.mealItems.length} meals</span>
                <span>
                  👥 {formatAssignedUsers(selectedMealPlan.assignedUsers)} assigned users
                </span>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="space-y-3">
                {selectedMealPlan.mealItems.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span>{meal.icon}</span>
                      <span className="w-[92px] shrink-0 font-medium text-gray-800">
                        {meal.label}
                      </span>
                    </div>
                    <span className="truncate text-gray-600">{meal.foods}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={openEditPlanModal}>Edit Plan</Button>
                <Button variant="outline" onClick={openAssignUsersModal}>
                  Assign Users
                </Button>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-gray-900">{selectedMealPlan.planName}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatCalories(selectedMealPlan.caloriesPerDay)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Assigned Users</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatAssignedUsers(selectedMealPlan.assignedUsers)}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {selectedMealPlan.mealItems.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span>{meal.icon}</span>
                  <span className="w-[92px] shrink-0 font-medium text-gray-800">
                    {meal.label}
                  </span>
                </div>
                <span className="truncate text-gray-600">{meal.foods}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={openEditPlanModal}>Edit Plan</Button>
            <Button variant="outline" onClick={openAssignUsersModal}>
              Assign Users
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreateEditOpen}
        onClose={handleCloseCreateEditModal}
        className="max-w-[640px] p-6 m-4"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {createEditMode === "create" ? "Create Meal Plan" : "Edit Meal Plan"}
        </h2>
        <form className="mt-5 space-y-4" onSubmit={handleCreateEditSubmit}>
          <div>
            <label htmlFor="planName" className="mb-1 block text-sm font-medium text-gray-700">
              Plan Name
            </label>
            <input
              id="planName"
              ref={planNameInputRef}
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              value={createEditForm.planName}
              onChange={(event) => handleCreateEditChange("planName", event.target.value)}
            />
            {createEditErrors.planName ? (
              <p className="mt-1 text-xs text-red-600">{createEditErrors.planName}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="calories" className="mb-1 block text-sm font-medium text-gray-700">
              Calories Per Day
            </label>
            <input
              id="calories"
              type="number"
              min={1}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              value={createEditForm.caloriesPerDay}
              onChange={(event) => handleCreateEditChange("caloriesPerDay", event.target.value)}
            />
            {createEditErrors.caloriesPerDay ? (
              <p className="mt-1 text-xs text-red-600">{createEditErrors.caloriesPerDay}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="breakfast" className="mb-1 block text-sm font-medium text-gray-700">
                Breakfast Meal
              </label>
              <input
                id="breakfast"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={createEditForm.breakfastFood}
                onChange={(event) => handleCreateEditChange("breakfastFood", event.target.value)}
              />
              {createEditErrors.breakfastFood ? (
                <p className="mt-1 text-xs text-red-600">{createEditErrors.breakfastFood}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="lunch" className="mb-1 block text-sm font-medium text-gray-700">
                Lunch Meal
              </label>
              <input
                id="lunch"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={createEditForm.lunchFood}
                onChange={(event) => handleCreateEditChange("lunchFood", event.target.value)}
              />
              {createEditErrors.lunchFood ? (
                <p className="mt-1 text-xs text-red-600">{createEditErrors.lunchFood}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="dinner" className="mb-1 block text-sm font-medium text-gray-700">
                Dinner Meal
              </label>
              <input
                id="dinner"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={createEditForm.dinnerFood}
                onChange={(event) => handleCreateEditChange("dinnerFood", event.target.value)}
              />
              {createEditErrors.dinnerFood ? (
                <p className="mt-1 text-xs text-red-600">{createEditErrors.dinnerFood}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="snacks" className="mb-1 block text-sm font-medium text-gray-700">
                Snacks Meal
              </label>
              <input
                id="snacks"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                value={createEditForm.snacksFood}
                onChange={(event) => handleCreateEditChange("snacksFood", event.target.value)}
              />
              {createEditErrors.snacksFood ? (
                <p className="mt-1 text-xs text-red-600">{createEditErrors.snacksFood}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              {createEditMode === "edit" ? (
                <Button
                  type="button"
                  onClick={handleOpenDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete Plan
                </Button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCloseCreateEditModal}>
                Cancel
              </Button>
              <Button type="submit">
                {createEditMode === "create" ? "Create Plan" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAssignOpen} onClose={closeAssignModal} className="max-w-[420px] p-6 m-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assign Users</h2>
        <form className="mt-5 space-y-4" onSubmit={handleAssignUsersSubmit}>
          <div>
            <label
              htmlFor="assignedUsers"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Assigned Users Count
            </label>
            <input
              id="assignedUsers"
              ref={assignInputRef}
              type="number"
              min={0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              value={assignUsersValue}
              onChange={(event) => {
                setAssignUsersValue(event.target.value);
                setAssignError("");
              }}
            />
            {assignError ? <p className="mt-1 text-xs text-red-600">{assignError}</p> : null}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeAssignModal}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirmModal}
        className="max-w-[420px] p-6 m-4"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Delete Meal Plan
        </h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{editingOriginalName}</span>?
        </p>
        <p className="mt-2 text-xs text-red-600">
          This action cannot be undone in this session.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeDeleteConfirmModal}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeletePlan}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MealPlanDetails;
