import React, { useState, createContext } from "react";

export const NavContext = createContext();

export const NavProvider = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NavContext.Provider value={[mobileOpen, setMobileOpen]}>
      {props.children}
    </NavContext.Provider>
  );
};
