import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import the useParams hook
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const { token } = useParams(); // Extract the token from the URL
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Call the resetPassword API with the token and the new password
      await resetPassword({ token, password, passwordConfirm });
      setResetSuccess(true); // Update state to indicate password reset was successful
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  useEffect(() => {
    // Optional: Validate the token or handle additional logic if needed
    if (!token) {
      console.error("Token is missing!");
    }
  }, [token]);

  return (
    <div>
      <NavBar />
      <section className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-slate-200 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                Reset Password
              </h2>
              {resetSuccess ? (
                <div className="text-center">
                  <p className="text-green-600">
                    Your password has been successfully reset!
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    You can now{" "}
                    <a href="/login" className="text-blue-500">
                      login
                    </a>{" "}
                    with your new password.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="reset-password-form">
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="password"
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="passwordConfirm"
                      className="block text-sm font-bold mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="passwordConfirm"
                      placeholder="Confirm your new password"
                      value={passwordConfirm}
                      onChange={(e) => setpasswordConfirm(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                      value="Reset Password"
                    />
                  </div>
                </form>
              )}

              <div className="text-center mt-4">
                <p>
                  Remembered your password?{" "}
                  <a href="/login" className="text-blue-500">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default ResetPassword;
