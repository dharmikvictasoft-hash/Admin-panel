// controllers/adminController.js
import User from "../models/Users.js";

export const getTotalCaloriesAllUsers = async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        totalCalories: { $sum: "$caloriesBurned" }
      }
    }
  ]);

  res.json({
    totalCalories: result[0]?.totalCalories || 0
  });
};

export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTotalSteps = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalSteps: { $sum: "$steps" },
        },
      },
    ]);

    res.status(200).json({
      totalSteps: result[0]?.totalSteps || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};