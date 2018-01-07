//********************************************************************
// react-hot-loader needs to be the very first require in the project*
//********************************************************************
require("react-hot-loader");

import React from "react";
import BABYLON from "babylonjs";
import ReactBabylonJS from "react-babylonjs-3d";

import App from "./app";

const canvas = document.querySelector(".scene");
const renderer = ReactBabylonJS.createRenderer({ BABYLON, canvas });
renderer.render(<App />);
