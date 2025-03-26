import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const Status = () => {
    const {status,id} = useParams();
    const navigate = useNavigate()

    useEffect(async()=>{
       const response=await axios.post(`http://localhost:3000/verify/${id}`);
       if(response.data.success===true){
           navigate("/payment/success")
       }else{
           navigate("/payment/failure");
       }

    },[]);
  
    return (
      <>    
            <div className="h-screen flex items-center justify-center flex-col">
              <div className="w-1/2 shadow rounded-md py-5 flex items-center justify-center flex-col gap-y-4">
                    <h1 className='text-4xl text-center'>Status :{status}  </h1>
                    <h1 className='text-4xl text-center'>Id : {id} </h1>
                    <button onClick={()=>navigate(-1)} className="px-12 py-2 bg-black text-white">Back</button>
              </div>
            </div>
      </>
    )
}


export default Status