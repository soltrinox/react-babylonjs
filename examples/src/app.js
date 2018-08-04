import { hot } from "react-hot-loader";

import React from "react";

import Sample1 from "./sample-1";
import Sample2 from "./sample-2";
import Sample3 from "./sample-3";

class App extends React.Component {
    render() {
        return <Sample3 />;
    }
}

export default hot(module)(App);
