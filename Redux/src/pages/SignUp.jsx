import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
  });

  const navigate=useNavigate();

  const apiPath=useSelector((state)=>state.counter.backendPath);

  const handleChange=(e)=>{
     const {name,value}=e.target;
     setSignupData((prev)=>({...prev,[name]:value}));
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const signupHandler = async(e) => {
    e.preventDefault();
    console.log(signupData);
    try {
       const response=await axios.post(`${apiPath}/auth/signup`,signupData,{
           headers:{
               "Content-Type":"application/json",
               withCredentials:true
           }
       });
       if(response.data.success){
           localStorage.setItem('token',response.data.token);
           alert("Signup Completed");
           navigate("/");
       }
    } catch (error) {
       console.error(
         "Login failed:",
         error.response?.data?.message || error.message
       )
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-slate-300 rounded-md px-8 py-10 w-80">
        <h1 className="text-3xl font-bold underline text-center mb-6">
          Signup
        </h1>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            variant="outlined"
            onChange={handleChange}
            name="name"
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            onChange={handleChange}
            name="email"
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: "white" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Phone Number"
            type="number"
            name="phoneNumber"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              paddingY: "10px",
            }}
            onClick={signupHandler}
          >
            SignUp
          </Button>
        </Box>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link className="underline cursor-pointer" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
