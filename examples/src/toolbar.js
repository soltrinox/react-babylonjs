import { hot } from "react-hot-loader";

import React from "react";

const Toolbar = ({ selectView }) => {
    return (
        <div style={{ position: "absolute" }}>
            <button onClick={() => selectView(1)}>Example 1</button>
            <button onClick={() => selectView(2)}>Example 2</button>
            <button onClick={() => selectView(3)}>Example 3</button>
            <button onClick={() => selectView(4)}>Example 4</button>
        </div>
    );
};

export default hot(module)(Toolbar);
