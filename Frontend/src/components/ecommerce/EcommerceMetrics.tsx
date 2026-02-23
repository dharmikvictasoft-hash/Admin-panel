import { useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { IoFootstepsOutline } from "react-icons/io5";
import { RiFireLine } from "react-icons/ri";
import { LuUserCheck } from "react-icons/lu";
import {
  getTotalCalories,
  getTotalUsers,
  getTotalSteps,
} from "../../services/adminApi";

export default function EcommerceMetrics() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        const [usersRes, caloriesRes, stepsRes] = await Promise.all([
          getTotalUsers(),
          getTotalCalories(),
          getTotalSteps(),
        ]);

        setTotalUsers(usersRes.data.totalUsers);
        setTotalCalories(caloriesRes.data.totalCalories);
        setTotalSteps(stepsRes.data.totalSteps);
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
    };

    fetchAdminMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2 md:gap-6">
      {/* Total Users */}
      <div className="hover:shadow-lg rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <GroupIcon className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Total Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl">
              {totalUsers}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> 11.01%
          </Badge>
        </div>
      </div>

      {/* Active Users */}
      <div className="hover:shadow-lg rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <LuUserCheck className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Active Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl">5,359</h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon /> 9.05%
          </Badge>
        </div>
      </div>

      {/* Total Steps */}
      <div className="hover:shadow-lg rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <IoFootstepsOutline className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Total Steps</span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl">{totalSteps}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> 9.05%
          </Badge>
        </div>
      </div>

      {/* 🔥 Calories Burned */}
      <div className="hover:shadow-lg rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <RiFireLine className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Total Calories Burned</span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl">
              {totalCalories}
              <span className="font-normal text-[14px] ml-[10px]">kCal</span>
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> 10%
          </Badge>
        </div>
      </div>
    </div>
  );
}
