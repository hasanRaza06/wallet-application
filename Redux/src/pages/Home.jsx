import React from 'react'
import { useSelector,useDispatch} from 'react-redux'
import { setUserDetail } from '../redux/slice';

const Home = () => {
    setDetailsToRedux();
    const user=useSelector((state)=>(state.counter.userDetail));
    console.log(user)
  return (
    <div>
        {
            user.name
        }
    </div>
  )
}

export default Home


const setDetailsToRedux=()=>{
    const dispatch=useDispatch();
    const user=JSON.parse(localStorage.getItem("userDetail"));
    dispatch(setUserDetail(user));
}