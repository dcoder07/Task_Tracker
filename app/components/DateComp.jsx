import React from "react";
import { DatePicker } from "antd";
const dateFormatList = ["DD/MM/YYYY"];

export default function DateComp({ handleChange }) {
  return (
    <DatePicker
      format={dateFormatList}
      onChange={(date, dateString) => {
        handleChange(dateString);
      }}
    />
  );
}
