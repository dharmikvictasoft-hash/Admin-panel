import React from "react";
import UserTable from "../../components/common/UserTable";
import PageMeta from "../../components/common/PageMeta";
import Table, { TableColumn } from "../../components/common/Table";
import ScrollReveal from "../../components/common/ScrollReveal";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hook/useModal";

type UserStatus = "Active" | "Inactive" | "Suspended";

type UserRow = {
  id: string;
  name: string;
  email: string;
  goal: string;
  caloriesAvg: string;
  plan: string;
  status: UserStatus;
};

const initialUsers: UserRow[] = [
  {
    id: "user-1",
    name: "Aarav Patel",
    email: "aarav.patel@gmail.com",
    goal: "Lose",
    caloriesAvg: "1850",
    plan: "Free",
    status: "Active",
  },
  {
    id: "user-2",
    name: "Neha Sharma",
    email: "neha.sharma@gmail.com",
    goal: "Gain",
    caloriesAvg: "2400",
    plan: "Pro",
    status: "Inactive",
  },
  {
    id: "user-3",
    name: "Rohit Verma",
    email: "rohit.verma@gmail.com",
    goal: "Lose",
    caloriesAvg: "2100",
    plan: "Free",
    status: "Suspended",
  },
  {
    id: "user-4",
    name: "Priya Singh",
    email: "priya.singh@gmail.com",
    goal: "Maintain",
    caloriesAvg: "2000",
    plan: "Premium",
    status: "Active",
  },
  {
    id: "user-5",
    name: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    goal: "Gain",
    caloriesAvg: "2600",
    plan: "Pro",
    status: "Active",
  },
  {
    id: "user-6",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    goal: "Lose",
    caloriesAvg: "1750",
    plan: "Free",
    status: "Inactive",
  },
  {
    id: "user-7",
    name: "Aarav Patel",
    email: "aarav.patel@gmail.com",
    goal: "Lose",
    caloriesAvg: "1850",
    plan: "Free",
    status: "Active",
  },
  {
    id: "user-8",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    goal: "Lose",
    caloriesAvg: "1750",
    plan: "Free",
    status: "Suspended",
  },
  {
    id: "user-9",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    goal: "Lose",
    caloriesAvg: "1750",
    plan: "Free",
    status: "Inactive",
  },
  {
    id: "user-10",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    goal: "Lose",
    caloriesAvg: "1750",
    plan: "Free",
    status: "Active",
  },
];

const userStatusClasses: Record<UserStatus, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  Suspended: "bg-yellow-100 text-yellow-700",
};

function User() {
  const [users, setUsers] = React.useState<UserRow[]>(initialUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userFilters, setUserFilters] = React.useState({
    user: "All Users",
    goal: "All Users",
    status: "All Users",
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const { isOpen: isSummaryOpen, openModal: openSummary, closeModal: closeSummary } =
    useModal();

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    const matchesUser =
      userFilters.user === "All Users" ||
      userFilters.user === "Select User" ||
      (userFilters.user === "Active Users" && user.status === "Active") ||
      (userFilters.user === "Inactive Users" && user.status === "Inactive");

    const matchesGoal =
      userFilters.goal === "All Users" ||
      userFilters.goal === "Select Goal" ||
      user.goal === userFilters.goal;

    const matchesPlan =
      userFilters.status === "All Users" ||
      userFilters.status === "Select Plan" ||
      user.plan === userFilters.status;

    return matchesSearch && matchesUser && matchesGoal && matchesPlan;
  });

  const userColumns = React.useMemo<TableColumn<UserRow>[]>(() => {
    const baseColumns: TableColumn<UserRow>[] = [
      {
        id: "name",
        header: "Name",
        render: (row) => (
          <span className="font-semibold text-gray-800 dark:text-white/90">
            {row.name}
          </span>
        ),
      },
      { id: "email", header: "Email", render: (row) => row.email },
      { id: "goal", header: "Goal", render: (row) => row.goal },
      {
        id: "caloriesAvg",
        header: "Calories AVG",
        render: (row) => row.caloriesAvg,
        className: "font-semibold dark:text-success-400",
      },
      {
        id: "plan",
        header: "Plan",
        render: (row) => row.plan,
        className: "font-semibold dark:text-success-400",
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "text-center",
        className: "text-center",
        render: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${userStatusClasses[row.status]}`}
          >
            {row.status}
          </span>
        ),
      },
    ];

    if (!isEditMode) return baseColumns;

    const selectionColumn: TableColumn<UserRow> = {
      id: "selection",
      header: "",
      className: "w-[52px]",
      headerClassName: "w-[52px]",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedUserIds.includes(row.id)}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const checked = event.target.checked;
            setSelectedUserIds((prev) => {
              if (checked) return [...prev, row.id];
              return prev.filter((id) => id !== row.id);
            });
          }}
          aria-label={`Select ${row.name}`}
          className="h-4 w-4 cursor-pointer"
        />
      ),
    };

    return [selectionColumn, ...baseColumns];
  }, [isEditMode, selectedUserIds]);

  const selectedUsers = users.filter((user) => selectedUserIds.includes(user.id));
  const activeCount = filteredUsers.filter((user) => user.status === "Active").length;
  const inactiveCount = filteredUsers.filter((user) => user.status === "Inactive").length;
  const suspendedCount = filteredUsers.filter((user) => user.status === "Suspended").length;
  const averageCalories =
    filteredUsers.length > 0
      ? Math.round(
          filteredUsers.reduce((sum, user) => sum + Number(user.caloriesAvg), 0) /
            filteredUsers.length
        )
      : 0;

  const handleSuspend = () => {
    if (selectedUserIds.length === 0) return;
    setUsers((prev) =>
      prev.map((user) =>
        selectedUserIds.includes(user.id)
          ? { ...user, status: "Suspended" as UserStatus }
          : user
      )
    );
    setSelectedUserIds([]);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) setSelectedUserIds([]);
      return next;
    });
  };

  return (
    <>
      <PageMeta
        title="Users"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <ScrollReveal origin="left" delay={0.2} className="relative z-40">
        <UserTable
          onSearchChange={setSearchTerm}
          onDropdownChange={(id, value) =>
            setUserFilters((prev) => ({ ...prev, [id]: value }))
          }
        />
      </ScrollReveal>
      <ScrollReveal origin="right" delay={0.2} className="relative z-10">
        <Table
          columns={userColumns}
          data={filteredUsers}
          rowKey={(row) => row.id}
        />
      </ScrollReveal>
      <ScrollReveal origin="bottom" className="relative z-10">
        <div className="m-[17px] flex justify-end">
        <Button className="" onClick={openSummary}>View Summary </Button>
        <Button className="ml-[15px]" onClick={toggleEditMode}>
          {isEditMode ? "Done" : "Edit"}
        </Button>
        <Button
          className="ml-[15px] hover:bg-yellow-500 hover:text-white"
          onClick={handleSuspend}
          disabled={!isEditMode || selectedUserIds.length === 0}
        >
          Suspend
        </Button>
        </div>
      </ScrollReveal>

      <Modal isOpen={isSummaryOpen} onClose={closeSummary} className="max-w-[540px] m-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Users Summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Filtered Users</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{filteredUsers.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Average Calories</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{averageCalories}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Active</p>
            <p className="mt-1 text-lg font-semibold text-green-700">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-gray-500">Inactive</p>
            <p className="mt-1 text-lg font-semibold text-red-700">{inactiveCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-3 col-span-2">
            <p className="text-gray-500">Suspended</p>
            <p className="mt-1 text-lg font-semibold text-yellow-700">{suspendedCount}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-gray-200 p-3">
          <p className="text-sm text-gray-500">
            Selected Users:{" "}
            <span className="font-semibold text-gray-900">{selectedUsers.length}</span>
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={closeSummary}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default User;
