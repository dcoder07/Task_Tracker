import { SignedIn } from "@clerk/nextjs";
import React from "react";

const TicketsLayout = ({ children }) => {
  return <SignedIn>{children}</SignedIn>;
};

export default TicketsLayout;
