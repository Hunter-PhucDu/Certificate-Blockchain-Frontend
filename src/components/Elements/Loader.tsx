"use client";
import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

const StyledAppLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed; /* Change from absolute to fixed */
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(
    255,
    255,
    255,
    0.85
  ); /* Add semi-transparent background */
  z-index: 9999; /* Ensure it's above everything else */
`;

const Loader = () => {
  return (
    <StyledAppLoader>
      <Spin size="large" />
    </StyledAppLoader>
  );
};

export default Loader;
