import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { forgotPassword } from "../services/Api";

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false); // State to track if email is sent
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setEmailSent(true); // Update state to indicate email has been sent

      // Call the forgotPassword API and pass the email
      await forgotPassword({ email });
    } catch (error) {
      console.error("Error sending reset link:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <section className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-slate-200 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">
                Forgot Password
              </h2>
              {emailSent ? (
                <div className="text-center">
                  <p className="text-green-600">
                    A reset link has been sent to your email!
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Please check your inbox and follow the instructions to reset
                    your password.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="forgot-password-form">
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                      value="Send Reset Link"
                    />
                  </div>
                </form>
              )}

              <div className="text-center mt-4">
                <p>
                  Remembered your password?{" "}
                  <Link to="/login" className="text-blue-500">
                    Login
                  </Link>
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

export default ForgotPassword;
