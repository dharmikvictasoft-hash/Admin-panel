import React from "react";
import PageMeta from "../../components/common/PageMeta";
import ScrollReveal from "../../components/common/ScrollReveal";
import GroceryHeader from "../../components/common/Grocery";
import Table, { TableColumn } from "../../components/common/Table";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hook/useModal";

type GroceryStatus = "In Stock" | "Low Stock" | "Out of Stock";

type GroceryItem = {
  id: string;
  name: string;
  category: string;
  source: string;
  quantity: number;
  unit: string;
  status: GroceryStatus;
};

type GroceryFormState = {
  name: string;
  category: string;
  source: string;
  quantity: string;
  unit: string;
  status: GroceryStatus;
};

const initialGroceries: GroceryItem[] = [
  {
    id: "grocery-1",
    name: "Brown Rice",
    category: "Grains",
    source: "Vendor A",
    quantity: 40,
    unit: "kg",
    status: "In Stock",
  },
  {
    id: "grocery-2",
    name: "Paneer",
    category: "Dairy",
    source: "Local Market",
    quantity: 6,
    unit: "kg",
    status: "Low Stock",
  },
  {
    id: "grocery-3",
    name: "Spinach",
    category: "Vegetables",
    source: "Vendor B",
    quantity: 0,
    unit: "kg",
    status: "Out of Stock",
  },
  {
    id: "grocery-4",
    name: "Eggs",
    category: "Protein",
    source: "Vendor A",
    quantity: 120,
    unit: "pcs",
    status: "In Stock",
  },
];

const statusClasses: Record<GroceryStatus, string> = {
  "In Stock": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

const defaultForm: GroceryFormState = {
  name: "",
  category: "Grains",
  source: "Vendor A",
  quantity: "",
  unit: "kg",
  status: "In Stock",
};

function Grocery() {
  const [groceries, setGroceries] = React.useState<GroceryItem[]>(initialGroceries);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    category: "All Categories",
    source: "All Sources",
    status: "All Status",
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [selectedGrocery, setSelectedGrocery] = React.useState<GroceryItem | null>(null);
  const [editGrocery, setEditGrocery] = React.useState<GroceryItem | null>(null);
  const [addForm, setAddForm] = React.useState<GroceryFormState>(defaultForm);
  const { isOpen: isDetailsOpen, openModal: openDetails, closeModal: closeDetails } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const { isOpen: isAddOpen, openModal: openAdd, closeModal: closeAdd } = useModal();

  const filteredGroceries = groceries.filter((item) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.source.toLowerCase().includes(search);

    const matchesCategory =
      filters.category === "All Categories" || item.category === filters.category;
    const matchesSource = filters.source === "All Sources" || item.source === filters.source;
    const matchesStatus = filters.status === "All Status" || item.status === filters.status;

    return matchesSearch && matchesCategory && matchesSource && matchesStatus;
  });

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((value) => value !== id);
    });
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) setSelectedIds([]);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setGroceries((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const handleRestock = () => {
    if (selectedIds.length === 0) return;
    setGroceries((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? {
              ...item,
              status: "In Stock",
              quantity: item.quantity === 0 ? 10 : item.quantity,
            }
          : item
      )
    );
    setSelectedIds([]);
  };

  const handleOpenDetails = (item: GroceryItem) => {
    setSelectedGrocery(item);
    openDetails();
  };

  const handleOpenEdit = () => {
    if (!selectedGrocery) return;
    setEditGrocery(selectedGrocery);
    closeDetails();
    openEdit();
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editGrocery || !editGrocery.name.trim()) return;
    setGroceries((prev) =>
      prev.map((item) => (item.id === editGrocery.id ? editGrocery : item))
    );
    setSelectedGrocery(editGrocery);
    closeEdit();
  };

  const handleOpenAdd = () => {
    setAddForm(defaultForm);
    openAdd();
  };

  const handleAddGrocery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addForm.name.trim() || Number(addForm.quantity) < 0) return;

    const nextItem: GroceryItem = {
      id: `grocery-${Date.now()}`,
      name: addForm.name.trim(),
      category: addForm.category,
      source: addForm.source,
      quantity: Number(addForm.quantity),
      unit: addForm.unit.trim() || "kg",
      status: addForm.status,
    };
    setGroceries((prev) => [nextItem, ...prev]);
    closeAdd();
  };

  const columns = React.useMemo<TableColumn<GroceryItem>[]>(() => {
    const baseColumns: TableColumn<GroceryItem>[] = [
      {
        id: "name",
        header: "Item",
        render: (row) => (
          <span className="font-semibold text-gray-800 dark:text-white/90">{row.name}</span>
        ),
      },
      { id: "category", header: "Category", render: (row) => row.category },
      { id: "source", header: "Source", render: (row) => row.source },
      {
        id: "quantity",
        header: "Quantity",
        className: "font-semibold",
        render: (row) => `${row.quantity} ${row.unit}`,
      },
      {
        id: "status",
        header: "Status",
        render: (row) => (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[row.status]}`}>
            {row.status}
          </span>
        ),
      },
    ];

    if (!isEditMode) return baseColumns;

    const selectionColumn: TableColumn<GroceryItem> = {
      id: "selection",
      header: "",
      className: "w-[52px]",
      headerClassName: "w-[52px]",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => handleToggleSelect(row.id, event.target.checked)}
          aria-label={`Select ${row.name}`}
          className="h-4 w-4 cursor-pointer"
        />
      ),
    };

    return [selectionColumn, ...baseColumns];
  }, [isEditMode, selectedIds]);

  return (
    <>
      <PageMeta
        title="Grocery"
        description="This is React.js Grocery page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <ScrollReveal origin="left" delay={0.2} className="relative z-40">
        <GroceryHeader
          onSearchChange={setSearchTerm}
          onDropdownChange={(id, value) =>
            setFilters((prev) => ({
              ...prev,
              [id]: value,
            }))
          }
        />
      </ScrollReveal>

      <ScrollReveal origin="right" className="relative z-10">
        <Table
          columns={columns}
          data={filteredGroceries}
          rowKey={(row) => row.id}
          onRowClick={isEditMode ? undefined : handleOpenDetails}
        />
      </ScrollReveal>

      <ScrollReveal origin="top" className="relative z-10">
        <div className="m-[17px] flex justify-end gap-3">
          <Button onClick={handleOpenAdd}>Add Grocery</Button>
          <Button onClick={toggleEditMode}>{isEditMode ? "Done" : "Edit"}</Button>
          <Button
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300"
            onClick={handleRestock}
            disabled={selectedIds.length === 0}
          >
            Restock
          </Button>
        </div>
      </ScrollReveal>

      <Modal isOpen={isDetailsOpen} onClose={closeDetails} className="max-w-[520px] m-4 p-6">
        {selectedGrocery ? (
          <div className="space-y-2 text-sm text-gray-700">
            <h2 className="text-xl font-semibold text-gray-900">{selectedGrocery.name}</h2>
            <p>
              <span className="font-semibold">Category:</span> {selectedGrocery.category}
            </p>
            <p>
              <span className="font-semibold">Source:</span> {selectedGrocery.source}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {selectedGrocery.quantity}{" "}
              {selectedGrocery.unit}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {selectedGrocery.status}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={closeDetails}>
                Close
              </Button>
              <Button onClick={handleOpenEdit}>Edit</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEdit} className="max-w-[560px] m-4 p-6">
        {editGrocery ? (
          <form className="space-y-4" onSubmit={handleSaveEdit}>
            <h2 className="text-xl font-semibold text-gray-900">Edit Grocery</h2>
            <div>
              <label htmlFor="edit-grocery-name" className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="edit-grocery-name"
                type="text"
                value={editGrocery.name}
                onChange={(event) =>
                  setEditGrocery((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-grocery-category" className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="edit-grocery-category"
                  value={editGrocery.category}
                  onChange={(event) =>
                    setEditGrocery((prev) =>
                      prev ? { ...prev, category: event.target.value } : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                >
                  <option>Grains</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Protein</option>
                  <option>Dairy</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-grocery-status" className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="edit-grocery-status"
                  value={editGrocery.status}
                  onChange={(event) =>
                    setEditGrocery((prev) =>
                      prev ? { ...prev, status: event.target.value as GroceryStatus } : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-grocery-quantity" className="mb-1 block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  id="edit-grocery-quantity"
                  type="number"
                  min={0}
                  value={editGrocery.quantity}
                  onChange={(event) =>
                    setEditGrocery((prev) =>
                      prev ? { ...prev, quantity: Number(event.target.value) } : prev
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label htmlFor="edit-grocery-unit" className="mb-1 block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <input
                  id="edit-grocery-unit"
                  type="text"
                  value={editGrocery.unit}
                  onChange={(event) =>
                    setEditGrocery((prev) => (prev ? { ...prev, unit: event.target.value } : prev))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="edit-grocery-source" className="mb-1 block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                id="edit-grocery-source"
                type="text"
                value={editGrocery.source}
                onChange={(event) =>
                  setEditGrocery((prev) => (prev ? { ...prev, source: event.target.value } : prev))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
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
        <form className="space-y-4" onSubmit={handleAddGrocery}>
          <h2 className="text-xl font-semibold text-gray-900">Add Grocery</h2>
          <div>
            <label htmlFor="add-grocery-name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="add-grocery-name"
              type="text"
              value={addForm.name}
              onChange={(event) => setAddForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="add-grocery-category" className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="add-grocery-category"
                value={addForm.category}
                onChange={(event) => setAddForm((prev) => ({ ...prev, category: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              >
                <option>Grains</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Protein</option>
                <option>Dairy</option>
              </select>
            </div>
            <div>
              <label htmlFor="add-grocery-status" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="add-grocery-status"
                value={addForm.status}
                onChange={(event) =>
                  setAddForm((prev) => ({ ...prev, status: event.target.value as GroceryStatus }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              >
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="add-grocery-quantity" className="mb-1 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                id="add-grocery-quantity"
                type="number"
                min={0}
                value={addForm.quantity}
                onChange={(event) => setAddForm((prev) => ({ ...prev, quantity: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="add-grocery-unit" className="mb-1 block text-sm font-medium text-gray-700">
                Unit
              </label>
              <input
                id="add-grocery-unit"
                type="text"
                value={addForm.unit}
                onChange={(event) => setAddForm((prev) => ({ ...prev, unit: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="add-grocery-source" className="mb-1 block text-sm font-medium text-gray-700">
              Source
            </label>
            <input
              id="add-grocery-source"
              type="text"
              value={addForm.source}
              onChange={(event) => setAddForm((prev) => ({ ...prev, source: event.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeAdd}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Grocery;
