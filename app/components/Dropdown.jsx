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
            value:
              "https://images.nightcafe.studio/jobs/6FALlclA3dpCUGJaByxI/6FALlclA3dpCUGJaByxI--1--3vcpj.jpg?tr=w-1600,c-at_max",
          },
          {
            label: "Lucy",
            value:
              "https://img.freepik.com/premium-photo/vector-illustration-about-art-people_975572-12153.jpg",
          },
        ],
      },
      {
        label: "Engineer",
        options: [
          {
            label: "Jian-Yang",
            value:
              "https://play-lh.googleusercontent.com/XVrFfr6JSs81AUFro3-_Yzyu7ZamixHegD2M8jQidormWDe9cBH-O2tCM40A7Zr0zSk=w240-h480-rw",
          },
        ],
      },
    ]}
  />
);
export default Dropdown;
