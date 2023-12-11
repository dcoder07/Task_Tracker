import React from "react";
import { Select } from "antd";

const Dropdown = ({ handleChange }) => (
  <Select
    defaultValue='lucy'
    style={{
      width: 200,
    }}
    onChange={(value) => {
      handleChange(value);
    }}
    options={[
      {
        label: "Manager",
        options: [
          {
            label: "Jack",
            value: "jack",
          },
          {
            label: "Lucy",
            value: "lucy",
          },
        ],
      },
      {
        label: "Engineer",
        options: [
          {
            label: "Jian-Yang",
            value: "jian-yang",
          },
        ],
      },
    ]}
  />
);
export default Dropdown;
