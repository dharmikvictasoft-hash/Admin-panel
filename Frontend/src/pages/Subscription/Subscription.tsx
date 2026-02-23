import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeaderWithBreadcrumb from "../../components/common/PageHeaderWithBreadcrumb";
import ScrollReveal from "../../components/common/ScrollReveal";
import Table, { TableColumn } from "../../components/common/Table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hook/useModal";
import { SubscriptionPlan, initialSubscriptionPlans } from "./subscriptionData";
import {
  calculateActiveSubs,
  calculateMRR,
  calculateRevenue,
  formatINR,
  formatINRCompactLakh,
} from "./subscriptionUtils";

type CreateEditMode = "create" | "edit";

type PlanFormState = {
  planName: string;
  price: string;
  users: string;
};

type PlanFormErrors = Partial<Record<keyof PlanFormState, string>>;

const getDefaultFormState = (): PlanFormState => ({
  planName: "",
  price: "",
  users: "",
});

function Subscription() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>(initialSubscriptionPlans);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = React.useState<string[]>([]);
  const [createEditMode, setCreateEditMode] = React.useState<CreateEditMode>("create");
  const [editingPlanId, setEditingPlanId] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState<PlanFormState>(getDefaultFormState());
  const [formErrors, setFormErrors] = React.useState<PlanFormErrors>({});
  const {
    isOpen: isCreateEditOpen,
    openModal: openCreateEditModal,
    closeModal: closeCreateEditModal,
  } = useModal();
  const {
    isOpen: isDeleteConfirmOpen,
    openModal: openDeleteConfirmModal,
    closeModal: closeDeleteConfirmModal,
  } = useModal();

  const activeSubs = React.useMemo(() => calculateActiveSubs(plans), [plans]);
  const mrr = React.useMemo(() => calculateMRR(plans), [plans]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) {
        setSelectedPlanIds([]);
      }
      return next;
    });
  };

  const openCreatePlanModal = () => {
    setCreateEditMode("create");
    setEditingPlanId(null);
    setFormState(getDefaultFormState());
    setFormErrors({});
    openCreateEditModal();
  };

  const openEditPlanModal = (plan: SubscriptionPlan) => {
    setCreateEditMode("edit");
    setEditingPlanId(plan.id);
    setFormState({
      planName: plan.planName,
      price: String(plan.price),
      users: String(plan.users),
    });
    setFormErrors({});
    openCreateEditModal();
  };

  const closeFormModal = () => {
    closeCreateEditModal();
    setFormErrors({});
  };

  const toggleSelection = (planId: string, checked: boolean) => {
    setSelectedPlanIds((prev) => {
      if (checked) return [...prev, planId];
      return prev.filter((id) => id !== planId);
    });
  };

  const validateForm = (): boolean => {
    const nextErrors: PlanFormErrors = {};
    const normalizedName = formState.planName.trim().replace(/\s+/g, " ");
    const parsedPrice = Number(formState.price);
    const parsedUsers = Number(formState.users);

    if (normalizedName.length < 2) {
      nextErrors.planName = "Plan name must be at least 2 characters.";
    } else {
      const lowerName = normalizedName.toLowerCase();
      const duplicate = plans.some((plan) => {
        if (createEditMode === "edit" && plan.id === editingPlanId) return false;
        return plan.planName.trim().toLowerCase() === lowerName;
      });
      if (duplicate) {
        nextErrors.planName = "Plan name must be unique.";
      }
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = "Price must be a number greater than 0.";
    }

    if (!Number.isFinite(parsedUsers) || !Number.isInteger(parsedUsers) || parsedUsers < 0) {
      nextErrors.users = "Users must be a non-negative whole number.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitPlan = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    const normalizedName = formState.planName.trim().replace(/\s+/g, " ");
    const nextPlanData = {
      planName: normalizedName,
      price: Number(formState.price),
      users: Number(formState.users),
    };

    if (createEditMode === "create") {
      const nextPlan: SubscriptionPlan = {
        id: `sub-${Date.now()}`,
        ...nextPlanData,
      };
      setPlans((prev) => [...prev, nextPlan]);
    } else if (editingPlanId) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlanId ? { ...plan, ...nextPlanData } : plan
        )
      );
    }

    closeFormModal();
  };

  const openDeleteModal = () => {
    if (selectedPlanIds.length === 0) return;
    openDeleteConfirmModal();
  };

  const handleDeleteSelected = () => {
    if (selectedPlanIds.length === 0) return;
    setPlans((prev) => prev.filter((plan) => !selectedPlanIds.includes(plan.id)));
    setSelectedPlanIds([]);
    closeDeleteConfirmModal();
  };

  const columns = React.useMemo<TableColumn<SubscriptionPlan>[]>(() => {
    const baseColumns: TableColumn<SubscriptionPlan>[] = [
      {
        id: "planName",
        header: "Plan",
        render: (row) => (
          <span className="font-semibold text-gray-800 dark:text-white/90">{row.planName}</span>
        ),
      },
      {
        id: "price",
        header: "Price",
        render: (row) => formatINR(row.price),
      },
      {
        id: "users",
        header: "Users",
        render: (row) => new Intl.NumberFormat("en-IN").format(row.users),
      },
      {
        id: "revenue",
        header: "Revenue",
        className: "font-semibold",
        render: (row) => formatINRCompactLakh(calculateRevenue(row.price, row.users)),
      },
    ];

    if (!isEditMode) return baseColumns;

    const selectionColumn: TableColumn<SubscriptionPlan> = {
      id: "selection",
      header: "",
      className: "w-[52px]",
      headerClassName: "w-[52px]",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedPlanIds.includes(row.id)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => toggleSelection(row.id, event.target.checked)}
          aria-label={`Select ${row.planName}`}
          className="h-4 w-4 cursor-pointer"
        />
      ),
    };

    return [selectionColumn, ...baseColumns];
  }, [isEditMode, selectedPlanIds]);

  return (
    <>
      <PageMeta
        title="Subscriptions"
        description="This is React.js Subscription page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="ml-[15px]">
        <ScrollReveal origin="left" delay={0.12} className="relative z-40">
          <PageHeaderWithBreadcrumb
            title="Subscriptions"
            crumbs={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Subscriptions" },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal origin="top" delay={0.16} className="relative z-10">
          <div className="mt-[20px] rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 hover:shadow-xl">
            <p className="text-base font-medium text-gray-800">
              Active Subs: {new Intl.NumberFormat("en-IN").format(activeSubs)} | MRR:{" "}
              {formatINRCompactLakh(mrr)}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal origin="right" delay={0.2} className="relative z-10">
          <Table
            columns={columns}
            data={plans}
            rowKey={(row) => row.id}
            onRowClick={isEditMode ? undefined : (row) => openEditPlanModal(row)}
          />
        </ScrollReveal>

        <ScrollReveal origin="top" delay={0.22} className="relative z-10">
          <div className="m-[17px] flex justify-end gap-3">
            <Button onClick={openCreatePlanModal}>Add Plan</Button>
            <Button onClick={toggleEditMode}>{isEditMode ? "Done" : "Edit"}</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
              onClick={openDeleteModal}
              disabled={!isEditMode || selectedPlanIds.length === 0}
            >
              Delete
            </Button>
          </div>
        </ScrollReveal>
      </div>

      <Modal isOpen={isCreateEditOpen} onClose={closeFormModal} className="max-w-[560px] m-4 p-6">
        <form onSubmit={handleSubmitPlan} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {createEditMode === "create" ? "Create Plan" : "Edit Plan"}
          </h2>

          <div>
            <label htmlFor="subscription-plan-name" className="mb-1 block text-sm font-medium text-gray-700">
              Plan Name
            </label>
            <input
              id="subscription-plan-name"
              type="text"
              value={formState.planName}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, planName: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="Monthly"
            />
            {formErrors.planName ? (
              <p className="mt-1 text-xs text-red-600">{formErrors.planName}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="subscription-plan-price" className="mb-1 block text-sm font-medium text-gray-700">
              Price (INR)
            </label>
            <input
              id="subscription-plan-price"
              type="number"
              min={0}
              step="0.01"
              value={formState.price}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, price: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="399"
            />
            {formErrors.price ? (
              <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="subscription-plan-users" className="mb-1 block text-sm font-medium text-gray-700">
              Users
            </label>
            <input
              id="subscription-plan-users"
              type="number"
              min={0}
              step="1"
              value={formState.users}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, users: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder="1420"
            />
            {formErrors.users ? (
              <p className="mt-1 text-xs text-red-600">{formErrors.users}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeFormModal}>
              Cancel
            </Button>
            <Button type="submit">{createEditMode === "create" ? "Create" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirmModal}
        className="max-w-[460px] m-4 p-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Delete Plans</h2>
          <p className="mt-3 text-sm text-gray-600">
            Are you sure you want to delete the selected subscription plans? This action cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteConfirmModal}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Subscription;
