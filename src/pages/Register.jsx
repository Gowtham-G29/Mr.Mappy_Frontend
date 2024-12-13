import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { signup } from "../services/Api";

function Register() {
  const initialState = {
    email: { required: false, invalid: false },
    password: { required: false, weak: false },
    passwordConfirm: { required: false, mismatch: false },
    name: { required: false },
    custom_error: null,
  };

  const [errors, setErrors] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePasswordStrength = (password) => password.length >= 6;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset errors before validation
    let validationErrors = { ...initialState };
    let hasError = false;

    // Validate inputs
    if (!inputs.name) {
      validationErrors.name.required = true;
      hasError = true;
    }
    if (!inputs.email) {
      validationErrors.email.required = true;
      hasError = true;
    } else if (!validateEmail(inputs.email)) {
      validationErrors.email.invalid = true;
      hasError = true;
    }
    if (!inputs.password) {
      validationErrors.password.required = true;
      hasError = true;
    } else if (!validatePasswordStrength(inputs.password)) {
      validationErrors.password.weak = true;
      hasError = true;
    }
    if (!inputs.passwordConfirm) {
      validationErrors.passwordConfirm.required = true;
      hasError = true;
    } else if (inputs.password !== inputs.passwordConfirm) {
      validationErrors.passwordConfirm.mismatch = true;
      hasError = true;
    }

    // If validation fails, set errors and stop submission
    if (hasError) {
      setErrors(validationErrors);
      return;
    }

    // Proceed with registration if no errors
    setLoading(true);
    try {
      const response = await signup({
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        passwordConfirm: inputs.passwordConfirm,
      });
      if (response.data.token) navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setLoading(false);

      // Default to a generic error message
      let customError = "An unexpected error occurred. Please try again later.";

      if (err.response) {
        const serverError = err.response.data?.message || customError;

        if (serverError === "User Already Registered") {
          customError = "This email is already registered.";
        } else if (serverError.includes("WEAK_PASSWORD")) {
          customError = "Password should be at least 6 characters.";
        } else {
          customError = serverError;
        }
      } else if (err.request) {
        customError = "Network error. Please check your connection.";
      } else {
        customError = "An unexpected error occurred. Please try again later.";
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
      <section className="register-block py-20 bg-hero-pattern min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-slate-200 p-8 shadow-md rounded-lg">
              <h2 className="text-center text-2xl font-bold mb-6">
                Register Now
              </h2>
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-semibold"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                    name="name"
                    id="name"
                    onChange={handleInput}
                    disabled={loading}
                  />
                  {errors.name.required && (
                    <span className="text-red-500 text-sm">
                      Name is required.
                    </span>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                    name="email"
                    id="email"
                    onChange={handleInput}
                    disabled={loading}
                  />
                  {errors.email.required && (
                    <span className="text-red-500 text-sm">
                      Email is required.
                    </span>
                  )}
                  {errors.email.invalid && (
                    <span className="text-red-500 text-sm">
                      Enter a valid email address.
                    </span>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-semibold"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                    name="password"
                    id="password"
                    onChange={handleInput}
                    disabled={loading}
                  />
                  {errors.password.required && (
                    <span className="text-red-500 text-sm">
                      Password is required.
                    </span>
                  )}
                  {errors.password.weak && (
                    <span className="text-red-500 text-sm">
                      Password should be at least 6 characters.
                    </span>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-gray-700 font-semibold"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control w-full p-2 border border-gray-300 rounded mt-1"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    onChange={handleInput}
                    disabled={loading}
                  />
                  {errors.passwordConfirm.required && (
                    <span className="text-red-500 text-sm">
                      Confirm Password is required.
                    </span>
                  )}
                  {errors.passwordConfirm.mismatch && (
                    <span className="text-red-500 text-sm">
                      Passwords do not match.
                    </span>
                  )}
                </div>

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
                  className="btn bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded mt-4 cursor-pointer"
                  value="Register"
                  disabled={loading}
                />

                <div className="text-center text-sm mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-500">
                    Login
                  </Link>
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

export default Register;
