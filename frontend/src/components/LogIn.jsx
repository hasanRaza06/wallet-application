import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const LogIn = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate=useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
    }
    try {
        const response = await axios.post(`http://localhost:3000/auth/signin`, formData, {
          headers: { "Content-Type": "application/json" }
        });
         if(response.data.success){
                toast.success("Signup Success!", { position: "top-right" });
                localStorage.setItem('token',response.data.token);
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...response.data.user, password: "" })
                );
                navigate('/');
              }
    } catch (error) {
        toast.error(error.response?.data?.message || "Login Failed");
        setLoading(false);
    }
};


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-96 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Log In</h1>
        <div className="mt-5 w-full">
          <TextField
            sx={{ marginTop: 2 }}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            sx={{ marginTop: 2 }}
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
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
          <h1 className="mt-2 flex justify-end text-sm">
            Don't have an account? <Link to="/signup" className="ml-2 underline">Signup</Link>
          </h1>
          <LoadingButton
            sx={{ marginTop: 2, padding: 2 }}
            onClick={handleSubmit}
            fullWidth
            variant="outlined"
            loading={loading}
            loadingPosition="end"
          >
            {loading ? "" : "Sign In"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
