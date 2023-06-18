// import React, { useState, useEffect } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import NavBar from "./NavBar";
// import { useNavigate } from "react-router-dom";



// const AuthDetails = () => {
//   const [authUser, setAuthUser] = useState(null);
  
//   const navigate = useNavigate();


//   useEffect(() => {
//     const listen = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setAuthUser(user);
//         setIsLoggedIn(true);
//       } else {
//         setAuthUser(null);
//         setIsLoggedIn(false);
//       }
//     });

//     return () => {
//       listen();
//     };
//   }, []);

//   const handleSignOut = () => {
//     signOut(auth)
//       .then(() => {
//         console.log("sign out successful");
//         setIsLoggedIn(false);
//         navigate("/");
//       })
//       .catch((error) => console.log("Sign out error:", error));
//   };

//   return (
//     <>
//       <NavBar isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
//       {authUser ? <p>Signed In</p> : <p>Signed Out</p>}
//     </>
//   );
// };

// export default AuthDetails;
