"use client";
import { useState, createContext, useEffect, useContext } from "react";
import { FormEvent } from "react";
import LoginComponent from "./loginComponents/LoginComponent";
import SignupComponent from "./loginComponents/SignupComponent";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import sha256 from "sha256";
import Cookies from "js-cookie";
import Header from "../components/Header";

export const UserEntryPageContext = createContext(null);

export default function SignUpForm() {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [loginPage, setLoginPage] = useState(true);

  const router = useRouter();
  if (Cookies.get("user_id")) {
    router.push("/");
  }

  // get user input
  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    console.log(sha256(username));
    // setUserId(sha256(username));
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (loginPage) {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      const res = await response.json();
      console.log(res.data);
      if (response.status === 500 && res.data.data == "inauthenticated") {
        setError("your username or password is incorrect :( please try again!");
      } else if (
        response.status === 500 &&
        res.data.data == "error logging in"
      ) {
        setError("unknown error occured. probably josh's fault.");
      } else if (response.status === 500 && res.data == "user not found") {
        setError("that account does not exist!");
      } else {
        // setLoggedIn(true);
        Cookies.set("user_id", sha256(username));
        router.push("/");
        setError("");
      }
    } else {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      const res = await response.json();
      console.log(res);
      console.log(response.status);
      console.log("res" + res.data.data);

      if (response.status === 500 && res.data.data == "user already exists") {
        setError("that username or email is already in use. try another one!");
      } else if (
        response.status === 500 &&
        res.data.data == "error creating user"
      ) {
        setError("unknown error occured. probably josh's fault.");
      } else if (
        response.status === 500 &&
        res.data.data == "fields undefined"
      ) {
        setError("please fill out all fields!");
      } else if (
        response.status === 500 &&
        res.data.data == "password too short"
      ) {
        setError("please make your password at least eight characters long!");
      } else {
        setError("");
        Cookies.set("user_id", sha256(username));
        router.push("/");
      }
    }
  };

  return (
    <>
      <Header loginHeader={true} />
      <UserEntryPageContext.Provider
        value={{
          handleSubmit,
          handleEmailChange,
          handleUserNameChange,
          handlePasswordChange,
          setLoginPage,
          error,
        }}
      >
        {loginPage ? <LoginComponent /> : <SignupComponent />}
      </UserEntryPageContext.Provider>
    </>
  );
}

