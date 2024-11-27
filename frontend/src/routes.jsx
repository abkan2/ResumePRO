import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
  
  import ProtectedRoutes from "./util/ProtectedRoutes.jsx";
  
  import LoginPage from "./pages/LoginStuff/Login.jsx";
  import SignUp from "./pages/SignUpStuff/SignUp.jsx";
  //import Home from "./pages/chatboxStff/Home.jsx";
  import ChatBot from "./pages/chatboxStff/Home.jsx";
  
  
  export const RoutesToPages = () => {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
  

  
<Route element={<ProtectedRoutes/>}> 

          <Route path="/home" element={<ChatBot />} /> 
          
</Route>
          <Route path="/signup" element={<SignUp />} />
  
        </Routes>
      </Router>
    );
  };
  
  export default RoutesToPages;