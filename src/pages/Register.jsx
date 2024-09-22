import { useState } from "react";
import { storeUserData } from "../services/Storage";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { RegisterApi } from "../services/api";

function Register() {
  const initialState = {
    email: { required: false },
    password: { required: false },
    name: { required: false },
    custom_error: null,
  };

  const [errors, setErrors] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
  });

  // useNavigate hook to programmatically navigate to login after registration
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = initialState;
    let hasError = false;

    if (inputs.name === "") {
      errors.name.required = true;
      hasError = true;
    }
    if (inputs.email === "") {
      errors.email.required = true;
      hasError = true;
    }
    if (inputs.password === "") {
      errors.password.required = true;
      hasError = true;
    }

    if (!hasError) {
      setLoading(true);
      RegisterApi(inputs)
        .then((response) => {
          storeUserData(response.data.idToken);
          // Navigate to login page after successful registration
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.data.error === "Email already exists") {
            setErrors({
              ...errors,
              custom_error: "This email has already been registered!",
            });
          } else if (
            String(err.response.data.error.message).includes("WEAK_PASSWORD")
          ) {
            setErrors({
              ...errors,
              custom_error: "Password should be at least 6 characters!",
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setErrors({ ...errors });
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
                  />
                  {errors.email.required && (
                    <span className="text-red-500 text-sm">
                      Email is required.
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
                  />
                  {errors.password.required && (
                    <span className="text-red-500 text-sm">
                      Password is required.
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
                  Already have an account?
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
