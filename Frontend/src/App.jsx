import {} from "react";
import AppLayout from "./layout/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import User from "./pages/User/User";
import ProtectedRoute from "./services/ProtectedRoute";
import FoodDB from "./pages/Food/FoodDB"
import MealPlan from "./pages/Meal/MealPlan";
import MealPlanDetails from "./pages/Meal/MealPlanDetails";
import Grocery from "./pages/Grocery/Grocery";
import "./App.css";
import Subscription from "./pages/Subscription/Subscription";
import Notify from "./pages/Notify/Notify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />
            <Route index path="/users" element={<User />} />
            <Route index path="/food" element={<FoodDB />} />
            <Route index path="/meals" element={<MealPlan />} />
            <Route path="/meals/:planName" element={<MealPlanDetails />} />
            <Route path="/grocery" element={<Grocery />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/notify" element={<Notify />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
