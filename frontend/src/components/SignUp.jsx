import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber:null
  });

  // Handle Input Change
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Form
  const handleSubmit = async () => {
    setError(""); // Reset error on each submit

    // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

    // if (!passwordRegex.test(formData.password)) {
    //   setError("Password must be at least 6 characters, include an uppercase letter, a number, and a special character.");
    //   toast.error("Invalid password format!", { position: "top-right" });
    //   return;
    // }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", formData);
      //console.log("Signup Success:", response.data);
      if(response.data.success){
        toast.success("Signup Success!", { position: "top-right" });
        localStorage.setItem('token',response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...response.data.newUser, password: "" })
        );
        navigate('/');
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "Signup Failed!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-96 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Sign Up</h1>
        <div className="mt-5 w-full">
          {/* Full Name */}
          <TextField
            sx={{ marginTop: 2 }}
            name="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          {/* Email */}
          <TextField
            sx={{ marginTop: 2 }}
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          {/* Password */}
          <TextField
            sx={{ marginTop: 2 }}
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </span>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password */}
          <TextField
            sx={{ marginTop: 2 }}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </span>
                </InputAdornment>
              ),
            }}
          />

         <TextField
            sx={{ marginTop: 2 }}
            name="phoneNumber"
            label="Phone Number"
            type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          {/* Login Link */}
          <h1 className="mt-2 flex justify-end text-sm">
            Already have an account? <Link to="/login" className="ml-2 underline">Login</Link>
          </h1>

          {/* Signup Button */}
          <LoadingButton
            sx={{ marginTop: 2, padding: 2 }}
            onClick={handleSubmit}
            fullWidth
            variant="outlined"
            loading={loading}
            loadingPosition="end"
          >
            {loading ? "" : "Sign Up"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
