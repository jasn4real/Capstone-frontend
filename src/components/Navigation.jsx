import React, { useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

function Navigation() {
  const [currentForm, setcurrentForm] = useState("login");

  const toggleForm = (formName) => {
    setcurrentForm(formName);
  };

  return (
    <div className="Navigation">
      {currentForm === "login" ? (
        <LogIn onFormSwitch={toggleForm} />
      ) : (
        <SignUp onFormSwitch={toggleForm} />
      )}
    </div>
  );
}

export default Navigation;
