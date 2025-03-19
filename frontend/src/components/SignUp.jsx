import React,{useState} from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-96 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">SignUp</h1>
        <div className="mt-5">
          <TextField id="outlined-basic" label="Email" type="email" variant="outlined" fullWidth={true} required />
          <TextField sx={{marginTop:2}} id="outlined-basic" type={showPassword?'text':'password'} label="Password" variant="outlined" fullWidth={true} required  slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {showPassword ? (
                                <span title="Hide" className="cursor-pointer">
                                  <IoEyeOffOutline
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                </span>
                              ) : (
                                <span title="Show" className="cursor-pointer">
                                  <IoEyeOutline
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                </span>
                              )}
                            </InputAdornment>
                          ),
                        },
                      }}/>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
