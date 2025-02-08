import React, { useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import LoginStyles from "./LoginPage.module.css"

import googleIcon from "../../assets/google-icon.png"



import { doSignInWithEmailAndPassword ,doSignInWithGoogle} from "./../../firebase/auth";
import { useAuth } from "../../context/authContext";

function LoginPage()
{
  const {userLoggedIn} = useAuth() || {}
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [errorMessage, setErrorMessage]= useState("");

  const navigate = useNavigate()


    const onSubmit = async (e) => {
      e.preventDefault()
      if (!isSigningIn)
      {
        setIsSigningIn(true);
        setErrorMessage("")
        try{
          await doSignInWithEmailAndPassword(email, password)
          navigate("/home");
        }
        catch (error){
          setErrorMessage("Login failed. Please check your credentials. ");
        }

        setIsSigningIn(false);
      }
    }

    const signInWithGoogle = async(e) =>
    {
      e.preventDefault()
      if (!isSigningIn)
      {
        try{
          await doSignInWithGoogle();
          navigate("/home")
        }
        catch (error)
        {
          setErrorMessage("Failed to log in with Google. Please try again. ")
        }

      }
    }

    if (userLoggedIn){
      return <Navigate to = "/home" replace= {true}/>;
    }


 
    return (

            <>
              <div className={LoginStyles.pageContainer}>
                <h1 className={LoginStyles.pageTitle}>ResumePRO</h1>
              </div>
        
              <div className={LoginStyles.loginCardContainer}>
                <h1>Login</h1>
        
        
        
                <form onSubmit={onSubmit}>
                  <label htmlFor="username-entry">Email</label>
                  <input
                    type="email"
                    placeholder="Type your email"
                    className={LoginStyles.loginInput}
                    id="username-entry"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Clear error on input change
                  />
        
                  <label htmlFor="password-entry">Password</label>
                  <input
                    type="password"
                    placeholder="Type your password"
                    className={LoginStyles.loginInput}
                    id="password-entry"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Clear error on input change
                  />
        
                  <button
                    className={LoginStyles.loginButton}
                    type="submit"
                    disabled={isSigningIn} // Disable button while signing in


                  >
                    {isSigningIn ? "Signing In..." : "Login"}
    
                  </button>

                  {errorMessage && <p className={LoginStyles.errorMessage}>{errorMessage}</p>} {/* Show error message if any */}
                </form>
        
                <div className={LoginStyles.orText}>Or</div>
                <button className={LoginStyles.googleButton} onClick={(signInWithGoogle)}>
                  <img src={googleIcon} alt="Google" className={LoginStyles.googleIcon} />
                  Continue with Google
                </button>
        
                <a href="/signup" className={LoginStyles.signupLink}>
                  New Here? Sign up
                </a>
              </div>
            </>
          );
        

}

export default LoginPage