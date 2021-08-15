import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Home = (props) => {
  const { currentUser } = useContext(UserContext);

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
      provident itaque porro hi.{" "}
      {currentUser ? currentUser.username : "Not auth"}
    </div>
  );
};

export default Home;
