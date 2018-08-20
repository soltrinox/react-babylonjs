import { hot } from "react-hot-loader";

import React from "react";

import Sample1 from "./sample-1";
import Sample2 from "./sample-2";
import Sample3 from "./sample-3";
import Sample4 from "./sample-4";

class App extends React.Component {
    constructor() {
        super();
        this.state = { currentView: 1 };
    }
    componentDidMount() {
        this._unsubscribe = this.props.store.subscribe(storeState =>
            this.setState({ currentView: storeState.currentView })
        );
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    render() {
        const { currentView } = this.state;
        return (
            <scene>
                {currentView === 1 ? <Sample1 /> : null}
                {currentView === 2 ? <Sample2 /> : null}
                {currentView === 3 ? <Sample3 /> : null}
                {currentView === 4 ? <Sample4 /> : null}
            </scene>
        );
    }
}

export default hot(module)(App);
