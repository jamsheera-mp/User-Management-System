import { useState } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors,setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error: serverError } = useSelector((state) => state.auth);
  
  const validateForm = () => {
    const newErrors = {};
    if (!name || name.length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = { name, email, password };
    const resultAction = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(resultAction)) {
      console.log("Registration successfull");
      
      navigate("/login");
    } else {
      console.log("Registration Failed");
      
      setErrors({ server: resultAction.payload?.message || "Registration failed" });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
        {errors.server && <p className="text-red-500 text-center mb-4">{errors.server}</p>}
        {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Name</label>
            <input 
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Email</label>
            <input 
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Password</label>
            <input 
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
           disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-gray-500 text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
