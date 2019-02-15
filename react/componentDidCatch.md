# componentDidCatch

componentDidCatch错误处理指的是React组件中能捕获子组件树中的任何Javascript异常，打印出来，并且展示出备用UI的生命周期方法 从而避免了组件树崩溃。它能在整个渲染及构建dom树的过程中捕获异常

创建方法： 定义新的生命周期方法：

        componentDidCatch(error, errorInfo)

第一个参数指的是抛出的实际错误。第二个参数是指错误信息，它返回带有“componentStack”属性的对象，“componentStack”属性包含组件的错误跟踪信息，这将告诉你组件在哪里失效！。

> 注意： 它不能捕获自身的错误，而是将错误传给离它最近的异常上


实例：

        import React from "react";
        import { render } from "react-dom";
        import Hello from "./Hello";



        class ShowMyError extends React.Component {
        constructor(props) {
            super(props);
            this.state = { error: false };
        }

        componentDidCatch(error, info) {
            this.setState({ error, info });
        }

        render() {
            if (this.state.error) {
            return (
                <div>
                <h1>
                    Error AGAIN: {this.state.error.toString()}
                </h1>
                {this.state.info &&
                    this.state.info.componentStack.split("\n").map(i => {
                    return (
                        <div key={i}>
                        {i}
                        </div>
                    );
                    })}
                </div>
            );
            }
            return this.props.children;
        }
        }

        class Broken extends React.Component {
        constructor(props) {
            super(props);
            this.state = { throw: false, count: 0 };
        }

        render() {
            if (this.state.throw) {
            throw new Error("YOLO");
            }

            return (
            <div>
                <button
                onClick={e => {
                    this.setState({ throw: true });
                }}
                >
                button will render error.
                </button>
                
                <button onClick={e => {
                this.setState(({ count }) => ({
                    count: count + 1
                }));
                }}>button will not throw</button>

                <div>
                {"All good here. Count: "}{this.state.count}
                </div>
            </div>
            );
        }
        }

        class App extends React.Component {
        render() {
            const styles = {
            fontFamily: "sans-serif",
            textAlign: "center"
            };
            return (
            <div>
            <p style={{maxWidth: "400px", margin: "0 auto", lineHeight: "1.5rem", border: "1px solid black", borderRadius: "8px", padding: "10px 15px", background: "gold"}}>
            CODESANDBOX is running in an environment that prevents <code>componentDidCatch</code> from working properly. 
            <br/> 
            <a href="https://codepen.io/blairbear/pen/GQrMPW">Checkout this CodePen instead</a>
            <br/>
            component preserved below for posterity.
            </p>
            <div style={styles}>
                <Hello name="ShowMyError" />
                <h2>Start clicking to see some {"\u2728"}magic{"\u2728"}</h2>
                <ShowMyError>
                    <Broken />
                </ShowMyError>
            </div>
            </div>
            );
        }
        }

        render(<App />, document.getElementById("root"));


