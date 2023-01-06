import React from "react";

// import { Container } from './styles';

const Flex: React.FC = () => {
  return (
    <div
      style={{ maxWidth: "1000px" }}
      className="bg-success d-flex justify-content-around flex-wrap mx-auto"
    >
      <div
        style={{ width: "250px", height: "400px" }}
        className="bg-danger"
      ></div>
      <div
        style={{ width: "250px", height: "400px" }}
        className="bg-danger"
      ></div>
      <div
        style={{ width: "250px", height: "400px" }}
        className="bg-danger"
      ></div>
      <div
        style={{ width: "250px", height: "400px" }}
        className="bg-danger"
      ></div>
      <div
        style={{ width: "250px", height: "400px" }}
        className="bg-danger"
      ></div>
    </div>
  );
};

export default Flex;
