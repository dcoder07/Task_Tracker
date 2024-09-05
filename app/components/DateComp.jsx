import React from "react";
import { DatePicker } from "antd";

export default function DateComp({ handleChange }) {
  return (
    <DatePicker
      format={"DD/MM/YYYY"}
      onChange={(date) => {
        handleChange(date.toDate());
      }}
    />
  );
}
