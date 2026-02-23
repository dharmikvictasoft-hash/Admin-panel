import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { signup } from "../../services/auth";


export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isChecked) {
      alert("Please Read Terms and Conditions");
      return;
    }
    setLoading(true);

    try {
      await signup({ fname, lname, email, password });
      alert("Account created successfully");
      navigate("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
          <Link
            to="/signup"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <ChevronLeftIcon className="size-5" />
            Back to dashboard
          </Link>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign Up
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Create your account
            </p>
            <div>
              {/* FORM */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Name */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label>Password *</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="size-5 fill-gray-500" />
                        ) : (
                          <EyeCloseIcon className="size-5 fill-gray-500" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <p className="text-sm text-gray-500">
                      I agree to the Terms & Privacy Policy
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>
              </form>
              <p className="mt-5 text-sm text-gray-700 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/signin" className="text-brand-500">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
