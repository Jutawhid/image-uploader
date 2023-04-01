import { useState } from "react";
import Link from "next/link";
import { auth } from "../firebase";
import { useEffect } from "react";
import { useRouter } from 'next/router'
import SigninForm from "../layouts/SigninForm";
export default function login({ user }) {
  const router = useRouter()
  useEffect(()=>{
    if(user){
        router.push('/')
    }
},[user])


  return (
    <div className="container center">
      <SigninForm/>
    </div>
  );
}
