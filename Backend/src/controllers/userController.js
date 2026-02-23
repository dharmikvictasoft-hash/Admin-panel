// controllers/userController.js
import User from "../models/Users.js";

const calculateCalories = (steps, weight) => {
  return steps * weight * 0.0005;
};

export const storeUserData = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      weight,
      steps,
      nutrition
    } = req.body;

    if (!email || !weight || steps === undefined) {
      return res.status(400).json({
        message: "email, weight and steps are required"
      });
    }

    let user = await User.findOne({ email });

    const caloriesBurned = calculateCalories(steps, weight);

    if (!user) {
      // create new user
      user = await User.create({
        fname,
        lname,
        email,
        weight,
        steps,
        caloriesBurned,
        nutrition
      });
    } else {
      // update existing user
      user.fname = fname ?? user.fname;
      user.lname = lname ?? user.lname;
      user.weight = weight;
      user.steps = steps;
      user.caloriesBurned = caloriesBurned;
      if (nutrition) user.nutrition = nutrition;

      await user.save();
    }

    res.json({
      message: "User data stored successfully",
      user: {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        weight: user.weight,
        steps: user.steps,
        caloriesBurned: user.caloriesBurned,
        nutrition: user.nutrition
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
