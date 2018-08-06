//********************************************************************
// react-hot-loader needs to be the very first require in the project*
//********************************************************************
require("react-hot-loader");

import React from "react";
import ReactDOM from "react-dom";
import BABYLON from "babylonjs";
import ReactBabylonJS from "react-babylonjs-3d";

import App from "./app";
import Toolbar from "./toolbar";
import Store from "./store";

const canvas = document.querySelector(".scene");
const renderer = ReactBabylonJS.createRenderer({ BABYLON, canvas });

const store = Store();
renderer.render(<App store={store} />);

const divToolbar = document.getElementById("toolbar");
ReactDOM.render(<Toolbar selectView={store.actions.selectView} />, divToolbar);
