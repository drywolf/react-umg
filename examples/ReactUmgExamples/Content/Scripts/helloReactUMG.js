'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/// <reference path="typings/ue.d.ts">/>

function GetPC() {
    return PlayerController.C(GWorld.GetAllActorsOfClass(PlayerController).OutActors[0]);
}

function main() {

    var _ = require('lodash');
    var React = require('react');
    var ReactUMG = require('../../../../lib'); // react-umg

    var widget = null;
    var PC = GetPC();

    // create a root widget
    widget = GWorld.CreateWidget(JavascriptWidget, PC);
    widget.JavascriptContext = Context;
    widget.bSupportsKeyboardFocus = true;

    var StatelessContainer = function StatelessContainer(_ref) {
        var children = _ref.children;
        return React.createElement(
            'vbox',
            null,
            children
        );
    };

    var ControlledText = function (_React$Component) {
        _inherits(ControlledText, _React$Component);

        function ControlledText(props, context) {
            _classCallCheck(this, ControlledText);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlledText).call(this, props, context));

            _this.state = { text: "controlled text-component" };
            return _this;
        }

        _createClass(ControlledText, [{
            key: 'onChange',
            value: function onChange(value) {
                this.setState({ text: value });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                return React.createElement(
                    'hbox',
                    null,
                    React.createElement('input', { value: this.state.text, onChange: function onChange(value) {
                            return _this2.onChange(value);
                        } }),
                    React.createElement(
                        'text',
                        null,
                        this.state.text
                    )
                );
            }
        }]);

        return ControlledText;
    }(React.Component);

    var UncontrolledText = function (_React$Component2) {
        _inherits(UncontrolledText, _React$Component2);

        function UncontrolledText(props, context) {
            _classCallCheck(this, UncontrolledText);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(UncontrolledText).call(this, props, context));

            _this3.state = { text: "uncontrolled text-component" };
            return _this3;
        }

        _createClass(UncontrolledText, [{
            key: 'onChange',
            value: function onChange(value) {
                this.setState({ text: value });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this4 = this;

                return React.createElement(
                    'hbox',
                    null,
                    React.createElement('input', { onChange: function onChange(value) {
                            return _this4.onChange(value);
                        } }),
                    React.createElement(
                        'text',
                        null,
                        this.state.text
                    )
                );
            }
        }]);

        return UncontrolledText;
    }(React.Component);

    var Stateful = function (_React$Component3) {
        _inherits(Stateful, _React$Component3);

        function Stateful(props, context) {
            _classCallCheck(this, Stateful);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Stateful).call(this, props, context));

            _this5.state = { count: 5 };
            return _this5;
        }

        _createClass(Stateful, [{
            key: 'onChange',
            value: function onChange(value) {
                this.setState({ count: parseInt(value) || 0 });
            }
        }, {
            key: 'render',
            value: function render() {
                var _this6 = this;

                return React.createElement(
                    'vbox',
                    null,
                    React.createElement('input', { value: this.state.count.toString(), onChange: function onChange(value) {
                            return _this6.onChange(value);
                        } }),
                    React.createElement(
                        'text',
                        null,
                        'item-count: ' + this.state.count.toString()
                    ),
                    _.times(this.state.count, function (i) {
                        return React.createElement(
                            'text',
                            { key: i },
                            'item_' + i.toString()
                        );
                    })
                );
            }
        }]);

        return Stateful;
    }(React.Component);

    ReactUMG.render(React.createElement(
        'vbox',
        null,
        React.createElement(
            'text',
            null,
            'Hello react-umg!'
        ),
        React.createElement(
            'text',
            null,
            'by @DrywolfDev'
        ),
        React.createElement('text', null),
        React.createElement(
            'text',
            null,
            new Date().toISOString()
        ),
        React.createElement(
            StatelessContainer,
            null,
            React.createElement(
                'text',
                null,
                'A'
            ),
            React.createElement(
                'text',
                null,
                'B'
            )
        ),
        React.createElement(
            StatelessContainer,
            null,
            React.createElement(
                'button',
                { onClick: function onClick() {
                        return console.log("click 1");
                    } },
                React.createElement(
                    'text',
                    null,
                    'Button 1'
                )
            ),
            React.createElement(
                'button',
                { onClick: function onClick() {
                        return console.log("click 2");
                    } },
                React.createElement(
                    'text',
                    null,
                    'Button 2'
                )
            ),
            React.createElement(UncontrolledText, null),
            React.createElement(ControlledText, null),
            React.createElement(Stateful, null)
        )
    ), widget);

    widget.AddToViewport();

    // Switch PC to UI only mode.
    PC.bShowMouseCursor = true;
    PC.SetInputMode_UIOnly(widget);

    return function () {
        widget.RemoveFromViewport();
    };
}

try {
    module.exports = function () {
        var cleanup = null;
        process.nextTick(function () {
            return cleanup = main();
        });
        return function () {
            return cleanup();
        };
    };
} catch (e) {
    require('bootstrap')('helloReactUMG');
}
