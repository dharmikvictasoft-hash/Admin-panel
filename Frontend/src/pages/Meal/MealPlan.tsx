import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Meal from "../../components/common/Meal";
import Table, { TableColumn } from "../../components/common/Table";
import Button from "../../components/ui/button/Button";
import ScrollReveal from "../../components/common/ScrollReveal";
import { MealPlanRow, formatCalories } from "./mealPlanData";
import { loadMealPlans, saveMealPlans } from "./mealPlanStorage";

const mealPlanColumns: TableColumn<MealPlanRow>[] = [
  {
    id: "planName",
    header: "Plan name",
    render: (row) => (
      <span className="font-semibold text-gray-800 dark:text-white/90">
        {row.planName}
      </span>
    ),
  },
  {
    id: "calories",
    header: "Calories",
    render: (row) => formatCalories(row.caloriesPerDay),
  },
  {
    id: "meals",
    header: "Meals",
    render: (row) => `${row.mealItems.length} meals`,
  },
  {
    id: "assignedUsers",
    header: "Assigned Users",
    headerClassName: "text-right",
    className: "text-right font-semibold",
    render: (row) => row.assignedUsers,
  },
];

function MealPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<MealPlanRow[]>(() => loadMealPlans());
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlanNames, setSelectedPlanNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [goalFilter, setGoalFilter] = useState("All Goals");

  useEffect(() => {
    saveMealPlans(plans);
  }, [plans]);

  useEffect(() => {
    const routeState = location.state as { createdPlan?: MealPlanRow } | null;
    const createdPlan = routeState?.createdPlan;
    if (!createdPlan) return;
    setPlans((prev) => {
      if (prev.some((plan) => plan.planName === createdPlan.planName)) {
        return prev;
      }
      return [...prev, createdPlan];
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedPlanNames([]);
      }
      return next;
    });
  };

  const toggleSelection = (planName: string, checked: boolean) => {
    setSelectedPlanNames((prev) => {
      if (checked) return [...prev, planName];
      return prev.filter((name) => name !== planName);
    });
  };

  const handleDeleteSelected = () => {
    if (selectedPlanNames.length === 0) return;
    setPlans((prev) =>
      prev.filter((plan) => !selectedPlanNames.includes(plan.planName))
    );
    setSelectedPlanNames([]);
  };

  const columns = useMemo(() => {
    if (!isEditMode) return mealPlanColumns;
    const selectionColumn: TableColumn<MealPlanRow> = {
      id: "selection",
      header: "",
      className: "w-[52px]",
      headerClassName: "w-[52px]",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedPlanNames.includes(row.planName)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => toggleSelection(row.planName, event.target.checked)}
          aria-label={`Select ${row.planName}`}
          className="h-4 w-4 cursor-pointer"
        />
      ),
    };
    return [selectionColumn, ...mealPlanColumns];
  }, [isEditMode, selectedPlanNames]);

  const filteredPlans = plans.filter((plan) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      plan.planName.toLowerCase().includes(search) ||
      plan.mealItems.some((item) => item.foods.toLowerCase().includes(search));
    const normalizedName = plan.planName.toLowerCase();
    const matchesGoal =
      goalFilter === "All Goals" ||
      goalFilter === "Select Goal" ||
      normalizedName.includes(goalFilter.toLowerCase());
    return matchesSearch && matchesGoal;
  });

  return (
    <>
      <div>
        <PageMeta
          title="Meal Plan"
          description="This is React.js Meal Plan page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <ScrollReveal origin="left" delay={0.2} className="relative z-40">
          <Meal
            onSearchChange={setSearchTerm}
            onDropdownChange={(id, value) => {
              if (id === "Goal") {
                setGoalFilter(value);
              }
            }}
          />
        </ScrollReveal>
        <ScrollReveal origin="right" delay={0.2} className="relative z-10">
          <Table
            columns={columns}
            data={filteredPlans}
            rowKey={(row) => row.planName}
            onRowClick={
              isEditMode
                ? undefined
                : (row) => navigate(`/meals/${encodeURIComponent(row.planName)}`)
            }
          />
        </ScrollReveal>
        <ScrollReveal origin="top" delay={0.2} className="relative z-10">
          <div className="m-[17px] flex justify-end gap-3">
            <Button
              className="hover:text-white"
              onClick={() => {
                const fallbackPlanName = plans[0]?.planName ?? "Weight Loss";
                navigate(`/meals/${encodeURIComponent(fallbackPlanName)}`, {
                  state: { openCreateModal: true, createModalSource: "list_add" },
                });
              }}
            >
              Add Meal Plan
            </Button>
            <Button className="hover:text-white" onClick={toggleEditMode}>
              {isEditMode ? "Done" : "Edit"}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
              onClick={handleDeleteSelected}
              disabled={selectedPlanNames.length === 0}
            >
              Delete
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}

export default MealPlan;
