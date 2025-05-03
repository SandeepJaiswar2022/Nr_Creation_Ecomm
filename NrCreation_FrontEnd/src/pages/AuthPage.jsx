import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ReusableComponents/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "@/store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    navigate(`/`)
  }


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return;
    }

    const userData = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

    try {
      if (isLogin) {
        await dispatch(loginUser(userData)).unwrap();
      } else {
        await dispatch(registerUser(userData)).unwrap();
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col space-y-7 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm"
        >
          <div>
            <h2 className="text-center text-3xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-[#871845] hover:text-[#611031] font-medium"
                disabled={loading}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {typeof error === "object"
                ? error.message || "An error occurred"
                : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            )}
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-[#871845]"
                    disabled={loading}
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#871845] hover:text-[#611031]"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#871845] hover:bg-[#611031]"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" disabled={loading}>
                Google
              </Button>
              <Button variant="outline" className="w-full" disabled={loading}>
                Facebook
              </Button>
            </div>
          </form>
        </motion.div>
        <Link to={`/`} className="text-black hover:bg-gray-300 transition-colors duration-700 bg-gray-200 p-3 rounded-lg font-medium text-sm">⬅️ Go to Home Page</Link>
      </div>

    </>
  );
};

export default AuthPage;
