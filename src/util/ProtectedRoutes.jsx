

import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

//import {userLoggedIn} from "/Users/abdulkanu/ToDolist React/EmotiGPT-Web/EmotiGPT/@latest/src/pages/Login/LoginPage.jsx"

const ProtectedRoutes = ()=>{
    const isAuthenticated = getAuth().currentUser || {};

    //const user = false;


    return isAuthenticated ? <Outlet/> : <Navigate to = "/login"></Navigate>
    
    
}

export default ProtectedRoutes

