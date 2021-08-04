import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../context/UserContext";
import { createAuthenticationEndPoint, AUTHENTICATIONENDPOINTS } from "../api";

const Home = (props) => {
  const { userName, setUserName, isLoggedIn, setIsLoggedIn } =
    useContext(UserContext);

  // if (!isLoggedIn) {
  //   return <Redirect to="/login" />;
  // }
  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt incidunt
      beatae sed quis. Vero excepturi, ipsam accusamus voluptates vel deserunt
      debitis voluptatem consectetur unde reiciendis aliquid provident itaque
      porro hiLorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
      incidunt beatae sed quis. Vero excepturi, ipsam accusamus voluptates vel
      deserunt debitis voluptatem consectetur unde reiciendis aliquid provident
      itaque porro hiLorem ipsum dolor sit amet consectetur adipisicing elit.
      Sunt incidunt beatae sed quis. Vero excepturi, ipsam accusamus voluptates
      vel deserunt debitis voluptatem consectetur unde reiciendis aliquid
      provident itaque porro hiLorem ipsum dolor sit amet consectetur
      adipisicing elit. Sunt incidunt beatae sed quis. Vero excepturi, ipsam
      accusamus voluptates vel deserunt debitis voluptatem consectetur unde
      reiciendis aliquid provident itaque porro hiLorem ipsum dolor sit amet
      consectetur adipisicing elit. Sunt incidunt beatae sed quis. Vero
      excepturi, ipsam accusamus voluptates vel deserunt debitis voluptatem
      consectetur unde reiciendis aliquid provident itaque porro hiLorem ipsum
      dolor sit amet consectetur adipisicing elit. Sunt incidunt beatae sed
      quis. Vero excepturi, ipsam accusamus voluptates vel deserunt debitis
      voluptatem consectetur unde reiciendis aliquid provident itaque porro
      hiLorem ipsum dolor sit amet consectetur adipisicing elit. Sunt incidunt
      beatae sed quis. Vero excepturi, ipsam accusamus voluptates vel deserunt
      debitis voluptatem consectetur unde reiciendis aliquid provident itaque
      porro hiLorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
      incidunt beatae sed quis. Vero excepturi, ipsam accusamus voluptates vel
      deserunt debitis voluptatem consectetur unde reiciendis aliquid provident
      itaque porro hiLorem ipsum dolor sit amet consectetur adipisicing elit.
      Sunt incidunt beatae sed quis. Vero excepturi, ipsam accusamus voluptates
      vel deserunt debitis voluptatem consectetur unde reiciendis aliquid
      provident itaque porro hi. {userName}
    </div>
  );
};

export default Home;
