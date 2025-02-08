import React, { useState } from "react";

import SignUpStyles from "./SignUpStyle.module.css"

import GoogleIcon from "../../assets/google-icon.png";


import { doCreateUserWithEmailAndPassword ,doSignInWithGoogle} from "./../../firebase/auth";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";



function SignUp()
{

  const {setCurrentUser} = useAuth() || {};
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

    const onSubmit = async(e) =>{
      e.preventDefault()
      if(!isRegistering)
      {
        setIsRegistering(false)
        setErrorMessage("")
        try{
          const userCreds = await doCreateUserWithEmailAndPassword(email, password);
          const user = userCreds.user;
          setCurrentUser(useReducedMotion)
          navigate("/home");
        }
        catch (error)
        {
          console.log(error); // Log the full error for debugging

          // Check for specific Firebase error codes
          if (error.code === "auth/email-already-in-use") {
            setErrorMessage("An account with this email already exists.");
          } else if (error.code === "auth/invalid-email") {
            setErrorMessage("The email address is not valid.");
          } else if (error.code === "auth/weak-password") {
            setErrorMessage("Password should be at least 6 characters.");
          } else {
            setErrorMessage("Sign up failed. Please try again.");
          }
        }
        setIsRegistering(false);
      }
    }

    const googleSignIn = async(e) =>{
      e.preventDefault();
      setErrorMessage("");
      if(!isRegistering)
      {
        try{
          await doSignInWithGoogle();
          navigate("/home");
        }
        catch(error)
        {
          "Could not complete sign up with Google. Please try again. "
        }
      }
    }


    const isSigningIn = false;
    return (

            <>
              <div className={SignUpStyles.pageContainer}>
                <h1 className={SignUpStyles.pageTitle}>ResumePRO</h1>
              </div>
        
              <div className={SignUpStyles.loginCardContainer}>
                <h1>Create Account</h1>
        
        
        
                <form onSubmit={onSubmit}>
                  <label htmlFor="username-entry">Email</label>
                  <input
                    type="email"
                    placeholder="Type your email"
                    className={SignUpStyles.loginInput}
                    id="username-entry"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Clear error on input change
                  />
        
                  <label htmlFor="password-entry">Password</label>
                  <input
                    type="password"
                    placeholder="Type your password"
                    className={SignUpStyles.loginInput}
                    id="password-entry"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Clear error on input change
                  />
        
                  <button
                    className={SignUpStyles.loginButton}
                    type="submit"
                    disabled={isSigningIn} // Disable button while signing in


                  >
                    {isSigningIn ? "Signing In..." : "Create Account"}
    
                  </button>

                  {errorMessage && <p className={SignUpStyles.errorMessage}>{errorMessage}</p>} {/* Show error message if any */}

                </form>
        
                <div className={SignUpStyles.orText}>Or</div>
                <button className={SignUpStyles.googleButton}>
                  <img src={googleIcon} alt="Google" className={SignUpStyles.googleIcon} onClick={googleSignIn} />
                  Continue with Google
                </button>
        
                <a href="/login" className={SignUpStyles.signupLink}>
                  Already have an account? Sign in
                </a>
              </div>
            </>
          );
        

}


export default SignUp

