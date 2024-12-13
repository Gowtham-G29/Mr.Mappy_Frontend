import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Login } from "../services/api";

function LoginPage() {
  
  const initialState = {
    email: { required: false },
    password: { required: false },
    custom_error: null,
  };

  const [errors, setErrors] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset errors before validation
    let validationErrors = { ...initialState };
    let hasError = false;

    // Validate inputs
    if (!inputs.email) {
      validationErrors.email.required = true;
      hasError = true;
    }
    if (!inputs.password) {
      validationErrors.password.required = true;
      hasError = true;
    }

    // Set errors if validation fails
    if (hasError) {
      setErrors(validationErrors);
      return;
    }

    // Proceed with login if no errors
    setLoading(true);
    try {
      const response = await Login({
        email: inputs.email,
        password: inputs.password,
      });
      setLoading(false);

      // Handle successful login
      if (response.data.token) {
        localStorage.clear();
        localStorage.setItem("jwt", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setLoading(false);
      const serverError = err.response?.data?.message || "An unexpected error occurred.";
      let customError = null;

      if (serverError === "Invalid password") {
        customError = "Invalid password.";
      } else if (serverError === "User Not Found") {
        customError = "Invalid Email! User Not Found.";
      } else {
        customError = "An error occurred. Please try again.";
      }

      setErrors({
        ...validationErrors,
        custom_error: customError,
      });
    }
  };

  const handleInput = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <NavBar />
      <section className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-slate-200 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">Login Now</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={inputs.email}
                    onChange={handleInput}
                    disabled={loading}
                    className={`w-full px-4 py-2 border ${
                      errors.email.required
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email.required && (
                    <span className="text-red-500 text-sm">
                      Email is required.
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleInput}
                    disabled={loading}
                    className={`w-full px-4 py-2 border ${
                      errors.password.required
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.password.required && (
                    <span className="text-red-500 text-sm">
                      Password is required.
                    </span>
                  )}
                  <div className="mt-2 text-right">
                    <Link
                      to="/forgot-password"
                      className="text-blue-500 text-sm"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <div className="mb-4">
                  {loading && (
                    <div className="text-center my-4">
                      <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  {errors.custom_error && (
                    <div className="text-red-500 text-center">
                      <p>{errors.custom_error}</p>
                    </div>
                  )}
                  <input
                    type="submit"
                    value="Login"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="text-center mt-4">
                  <p>
                    Create a new account? Please{" "}
                    <Link to="/register" className="text-blue-500">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LoginPage;
