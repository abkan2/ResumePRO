import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updatePassword ,GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "./firebase";

export const doCreateUserWithEmailAndPassword = (email, password)=>{
    return createUserWithEmailAndPassword(auth, email, password);
}

export const doSignInWithEmailAndPassword = (email, password)=>{
    return signInWithEmailAndPassword(auth, email,password);}

export const doSignOut = ()=>{
    return auth.signOut();
}

export const doPasswordRest = (email) => {
    return sendPasswordResetEmail(auth,email);

}

export const doPasswordChange = (password) =>{
    return updatePassword(auth.currentUser, password);
}

export const doSendEmailVerification = () =>
{
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,

    })
}

export const doSignInWithGoogle = async (email, password) =>
{
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider )
    const user = result.user
    return user;

}
