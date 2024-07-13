import React from "react";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu";
import "../MainContainer.css"; // Updated import path

export default function MainContainer() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <LeftMenu />
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <button onClick={() => navigate("/translate")}>Go to Translate</button>
      </div>
    </div>
  );
}