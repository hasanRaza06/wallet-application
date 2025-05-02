import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
//import { setUserDetail } from "../redux/slice";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData,setLoginData]=useState({
    email:"",
    password:""
  })

  //const dispatch = useDispatch();

  const apiPath=useSelector((state)=>state.counter.backendPath);

  const navigate=useNavigate();

  const handleChange=(e)=>{
      const {name,value}=e.target;
      setLoginData((prev)=>({...prev, [name]:value}));
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit=async(e)=>{
     e.preventDefault();
     try {
        const response=await axios.post(`${apiPath}/auth/signin`,loginData,{
            headers:{
                "Content-Type":"application/json",
                withCredentials:true
            }
        });
        if(response.data.success){
            localStorage.setItem('token',response.data.token);
            alert("Login Completed");
            //dispatch(setUserDetail(response.data.user));
            localStorage.setItem('userDetail',JSON.stringify(response.data.user));
            navigate("/");
        }
     } catch (error) {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        )
     }
     //console.log(loginData);
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-slate-300 rounded-md px-8 py-10 w-80">
        <h1 className="text-3xl font-bold underline text-center mb-6">
          Login
        </h1>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            name="email"
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="outlined"
            name="password"
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
          <Button
            variant="contained"
            sx={{
              background: "black",
              color: "white",
              paddingY: "10px",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            LogIn
          </Button>
        </Box>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline cursor-pointer">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
