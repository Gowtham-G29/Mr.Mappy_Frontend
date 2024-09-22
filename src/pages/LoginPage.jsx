import { useState } from "react";
import { storeUserData } from "../services/Storage";
import { isAuthenticated } from "../services/Auth";
import { Link,  useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { LoginApi } from "../services/api";

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
  
  const navigate = useNavigate();  // Use the navigate hook to programmatically navigate

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = initialState;
    let hasError = false;

    // Validate input fields
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
      // Call the Login API
      LoginApi(inputs)
        .then((response) => {
          // Store token and userId upon successful login
          storeUserData(response.data.token);
          localStorage.setItem('userId', response.data.userId);
          
          // After successful login and data storage, navigate to dashboard
          if (isAuthenticated()) {
            navigate('/dashboard');  // Navigate to dashboard
          }
        })
        .catch((err) => {
          if (err.code === "ERR_BAD_REQUEST") {
            setErrors({
              ...errors,
              custom_error: "Invalid Credentials.",
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
      <section className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-slate-200 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                Login Now
              </h2>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="email"
                    placeholder="email"
                    onChange={handleInput}
                  />
                  {errors.email.required && (
                    <span className="text-red-500 text-sm">
                      Email is required.
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="password"
                    placeholder="password"
                    onChange={handleInput}
                  />
                  {errors.password.required && (
                    <span className="text-red-500 text-sm">
                      Password is required.
                    </span>
                  )}
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
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                    value="Login"
                    disabled={loading}
                  />
                </div>

                <div className="text-center mt-4">
                  <p>
                    Create new account? Please{" "}
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
