const React = require('react');
const { reactApi: { Node, BabylonJSRenderer } } = require('react-babylonjs-3d');

const ComponentContainer = 'COMPONENT-CONTAINER';
const ComponentContainer2 = 'COMPONENT-CONTAINER-2';
const View1 = 'VIEW-1';
const View2 = 'VIEW-2';
const View = 'VIEW-0';

class App extends React.Component {
    render() {
        return <ComponentContainer valueProp={0} />;
    }
}

class App1 extends React.Component {
    constructor(props, context) {
        super(props, context);
        let i = 0;
        this.state = {
            i: i.toString(),
        };
        const interval = setInterval(() => {
            console.log({ i });
            i++;
            this.setState({ i: i.toString() });
            if (i >= 1) {
                clearInterval(interval);
            }
        }, 2000);
    }

    render() {
        return (
            <ComponentContainer valueProp={11}>
                <View number={11} i={this.state.i} />
            </ComponentContainer>
        );
    }
}

const App2 = () => [
    <ComponentContainer key="1" valueProp={22}>
        <View1 number={22} />
    </ComponentContainer>,
    <ComponentContainer2 key="2" valueProp={33}>
        <View2 number={33} />
    </ComponentContainer2>,
];

const Components = { App, App1, App };

const rootNode = new Node('AAAAA-ROOT');
const rootContainer = BabylonJSRenderer.createContainer(rootNode);

// BabylonJSRenderer.updateContainer(<App />, rootContainer, null);
BabylonJSRenderer.updateContainer(<Components.App1 />, rootContainer, null);
// BabylonJSRenderer.updateContainer(<Components.App2 />, rootContainer);
