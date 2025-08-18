import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ username }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const hasRepeatingChars = (password) => {
    for (let i = 0; i < password.length - 1; i++) {
      if (password[i] === password[i + 1]) {
        return true;
      }
    }
    return false;
  };

  const hasSpecialChar = (password) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(password);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else {
      if (formData.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
        isValid = false;
      } else if (hasRepeatingChars(formData.newPassword)) {
        errors.newPassword = "Password must not contain repeating characters";
        isValid = false;
      } else if (formData.newPassword === formData.oldPassword) {
        errors.newPassword = "New password must be different from current password";
        isValid = false;
      } else if (!hasSpecialChar(formData.newPassword)) {
        errors.newPassword = "Password must contain at least one special character";
        isValid = false;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setLoading(true);

  // Simulate 3-second loading delay
  setTimeout(async () => {
    try {
      const response = await fetch(
        "http://localhost/TICKETKAKSHA/Backend/Auth/change_password.php",
        // "https://ticketkaksha.com.np/Backend/Auth/change_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
          }),
        }
      );

      const data = await response.json();

      // ✅ Use backend status to decide success/error
      if (data.status === "success") {
        toast.success(data.message || "Password changed successfully", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred while changing password", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Change password error:", error);
    } finally {
      setLoading(false);
    }
  }, 3000); 
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <ToastContainer position="top-right" />
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.oldPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {validationErrors.oldPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.oldPassword}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>Password requirements:</p>
            <ul className="list-disc pl-5">
              <li className={formData.newPassword.length >= 8 ? "text-green-500" : ""}>
                Minimum 8 characters
              </li>
              <li className={!hasRepeatingChars(formData.newPassword) ? "text-green-500" : ""}>
                No repeating characters
              </li>
              <li className={hasSpecialChar(formData.newPassword) ? "text-green-500" : ""}>
                At least one special character
              </li>
              {/* <li className={formData.newPassword && formData.newPassword !== formData.oldPassword ? "text-green-500" : ""}>
                Different from current password
              </li> */}
            </ul>
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Changing Password...
            </span>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;