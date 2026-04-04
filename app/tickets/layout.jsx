import React from "react";
import AuthGuard from "@/app/components/AuthGuard";

const TicketsLayout = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default TicketsLayout;
