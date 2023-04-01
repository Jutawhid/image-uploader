import { useRouter } from "next/router";
import { useEffect } from "react";
import SignupForm from "../layouts/SignupForm";

export default function Signup({ user }) {
    const router = useRouter()
    useEffect(()=>{
        if(user){
            router.push('/')
        }
    },[user])
  return (
    <div className="container center">
      <SignupForm/>
    </div>
  );
}
