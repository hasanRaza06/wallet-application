import { createSlice } from "@reduxjs/toolkit";
 
const initialState={
    count:0,
    backendPath:"http://localhost:3000",
    userDetail:{},
    listItems:[
        { name: "Product", icon: "ShoppingCart" },
    { name: "Orders", icon: "ListAlt" },
    { name: "Brand", icon: "BrandingWatermark" },
    { name: "Colors", icon: "ColorLens" },
    { name: "Product Conditions", icon: "NewReleases" },
    { name: "Ip-address List", icon: "Security" },
    { name: "Size List", icon: "Business" },
    ]
}

export const mainSlice=createSlice({
    name:'mainSlice',
    initialState,
    reducers:{
        increment: (state) => { state.count += 1 },
        decrement: (state) => { state.count -= 1 },
        incrementByAmount: (state, action) => {
            state.count += action.payload
          },
        setUserDetail:(state,action)=>{
            state.userDetail=action.payload
        }  
    }
})

export const {increment,decrement,incrementByAmount,setUserDetail}=mainSlice.actions;
export default mainSlice.reducer;