/// <reference path="typings/ue.d.ts">/>

function GetPC() {
    return PlayerController.C(GWorld.GetAllActorsOfClass(PlayerController).OutActors[0])
}

function main() {

    const _ = require('lodash');
    const React = require('react');
    const ReactUMG = require('../../../../lib'); // react-umg

    let widget = null
    let PC = GetPC()

    // create a root widget
    widget = GWorld.CreateWidget(JavascriptWidget, PC)
    widget.JavascriptContext = Context
    widget.bSupportsKeyboardFocus = true

    const StatelessContainer = ({children}) =>
    (
        <vbox>
            {children}
        </vbox>
    );

    class ControlledText extends React.Component
    {
        constructor(props, context)
        {
            super(props, context);
            this.state = {text: "controlled text-component"};
        }

        onChange(value)
        {
            this.setState({text: value});
        }

        render()
        {
            return (
                <hbox>
                    <input value={this.state.text} onChange={value => this.onChange(value)}></input>
                    <text>{this.state.text}</text>
                </hbox>
            );
        }
    }

    class UncontrolledText extends React.Component
    {
        constructor(props, context)
        {
            super(props, context);
            this.state = {text: "uncontrolled text-component"};
        }

        onChange(value)
        {
            this.setState({text: value});
        }

        render()
        {
            return (
                <hbox>
                    <input onChange={value => this.onChange(value)}></input>
                    <text>{this.state.text}</text>
                </hbox>
            );
        }
    }

    class Stateful extends React.Component
    {
        constructor(props, context)
        {
            super(props, context);
            this.state = {count: 5};
        }

        onChange(value)
        {
            this.setState({count: parseInt(value) || 0});
        }

        render()
        {
            return (
                <vbox>
                    <input value={this.state.count.toString()} onChange={value => this.onChange(value)}></input>
                    <text>{'item-count: ' + this.state.count.toString()}</text>
                    {_.times(this.state.count, i => <text key={i}>{'item_' + i.toString()}</text>)}
                </vbox>
            );
        }
    }

    ReactUMG.render(
        <vbox>
            <text>Hello react-umg!</text>
            <text>by @DrywolfDev</text>
            <text/>
            <text>{new Date().toISOString()}</text>

            <StatelessContainer>
                <text>A</text>
                <text>B</text>
            </StatelessContainer>

            <StatelessContainer>
                <button onClick={() => console.log("click 1")}>
                    <text>Button 1</text>
                </button>
                
                <button onClick={() => console.log("click 2")}>
                    <text>Button 2</text>
                </button>

                <UncontrolledText/>
                <ControlledText/>

                <Stateful/>
            </StatelessContainer>
        </vbox>,
        widget
    );

    widget.AddToViewport()

    // Switch PC to UI only mode.
    PC.bShowMouseCursor = true
    PC.SetInputMode_UIOnly(widget)

    return function () {
        widget.RemoveFromViewport()
    }
}

try {
    module.exports = () => {
        let cleanup = null
        process.nextTick(() => cleanup = main());
        return () => cleanup()
    }
}
catch (e) {
    require('bootstrap')('helloReactUMG')
}
