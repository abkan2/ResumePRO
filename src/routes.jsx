import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
  
  import ProtectedRoutes from "./util/ProtectedRoutes.jsx";
  
  import LoginPage from "/Users/abdulkanu/ResumePRO/ResumePro/src/pages/LoginStuff/Login.jsx";
  import SignUp from "./pages/SignUpStuff/SignUp.jsx";
  import Home from "./pages/Home.jsx";
  
  
  export const RoutesToPages = () => {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
  

  
<Route element={<ProtectedRoutes/>}> 

          <Route path="/home" element={<Home />} />    
</Route>
          <Route path="/signup" element={<SignUp />} />
  
        </Routes>
      </Router>
    );
  };
  
  export default RoutesToPages;