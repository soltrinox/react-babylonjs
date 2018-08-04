import { hot } from "react-hot-loader";

import React from "react";

const MyApp = ({ selectView }) => {
    return (
        <div>
            <button onClick={() => selectView(1)}>1</button>
            <button onClick={() => selectView(2)}>2</button>
            <button onClick={() => selectView(3)}>3</button>
        </div>
    );
};

export default hot(module)(MyApp);