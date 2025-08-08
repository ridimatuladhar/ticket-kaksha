import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
    const lockUntil = parseInt(localStorage.getItem("lockUntil")) || 0;
    setAttempts(storedAttempts);

    const now = Date.now();
    if (now < lockUntil) {
      const secondsLeft = Math.floor((lockUntil - now) / 1000);
      setIsLocked(true);
      setRemainingTime(secondsLeft);
    }
  }, []);

  useEffect(() => {
    if (!isLocked || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          localStorage.removeItem("lockUntil");
          localStorage.setItem("loginAttempts", "0");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, remainingTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" + s : s}s`;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLocked) {
    setError("Locked. Please wait.");
    return;
  }

  setLoading(true);
  setError("");

  // Simulate delay for spinner
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
   //  const res = await fetch("http://localhost/TICKETKAKSHA/Backend/admin/admin_login.php", {
     const res = await fetch("https://ticketkaksha.com.np/Backend/admin/admin_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();

    if (res.ok && result.status === "success") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockUntil");
      navigate("/admin");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());

      if (newAttempts >= 3) {
        const lockUntil = Date.now() + 30 * 60 * 1000;
        localStorage.setItem("lockUntil", lockUntil.toString());
        setRemainingTime(Math.floor((lockUntil - Date.now()) / 1000));
        setIsLocked(true);
        setError("Too many failed attempts. Locked for 30 minutes.");
      } else {
        setError(result.message || "Login failed");
      }
    }
  } catch (err) {
    setError("Something went wrong.");
  } finally {
    setLoading(false);
  }
};



  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-4">
    
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded p-6 w-full max-w-sm"
    >
      
      <img 
      src="/src/assets/navlogo/ticketkakshalogo.png"
      alt="TicketKaksha Logo" 
      className="mb-4 w-52 h-auto mx-auto" 
    />
   
      <h2 className="text-2xl font-bold mb-4 text-[#2E6FB7] text-center">
        Admin Login
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {attempts > 0 && !isLocked && (
        <p className="text-yellow-600 text-sm mb-2">
          ⚠ Failed attempts: {attempts} / 3
        </p>
      )}
      {isLocked && (
        <p className="text-red-600 text-sm mb-4">
          🚫 Locked. Time remaining: {formatTime(remainingTime)}
        </p>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 mb-4 rounded"
        required
        disabled={isLocked || loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 mb-4 rounded"
        required
        disabled={isLocked || loading}
      />

      <button
        type="submit"
        className="w-full bg-[#2E6FB7] text-white py-2 rounded hover:bg-blue-400 disabled:opacity-50"
        disabled={isLocked || loading}
      >
        {loading ? "Verifying..." : isLocked ? "Locked" : "Login"}
      </button>
    </form>
  </div>
);
};

export default AdminLogin;