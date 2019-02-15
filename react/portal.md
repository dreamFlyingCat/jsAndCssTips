# portal及其注意点

用于将子节点渲染到父节点之外的dom节点，dom节点必须为有效的节点，而不能是通过ref获得并传递的virtual dom节点。

    render() {
    // React不需要创建一个新的div去包含子元素，直接将子元素渲染到另一个
    //dom节点中
    //这个dom节点可以是任何有效的dom节点，无论其所处于dom树中的哪个位置 

    return ReactDOM.createPortal(
        this.props.children,
        domNode,
    );
    }
 
> 注意：

* ReactDOM.createPortal函数的第二个参数，是被插入的dom节点，并且这个dom节点是有效的节点，而不能是通过ref获得并传递的virtual dom节点。

* 在父节点下，通过Portal插入的子节点也可以共享context。

* 通过portals冒泡，对于事件冒泡，从Portal节点中触发的事件，虽然可能改变了节点所处的位置，但是在HTML结构中的父包含节点是可以拿到这个事件的。

        <html>
        <body>
            <div id="app-root"></div>
            <div id="modal-root"></div>
        </body>
        </html>

        // These two containers are siblings in the DOM
        const appRoot = document.getElementById('app-root');
        const modalRoot = document.getElementById('modal-root');

        class Modal extends React.Component {
        constructor(props) {
            super(props);
            this.el = document.createElement('div');
        }

        componentDidMount() {
            modalRoot.appendChild(this.el);
        }

        componentWillUnmount() {
            modalRoot.removeChild(this.el);
        }

        render() {
            return ReactDOM.createPortal(
            this.props.children,
            this.el,
            );
        }
        }

        class Parent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {clicks: 0};
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
            // This will fire when the button in Child is clicked,
            // updating Parent's state, even though button
            // is not direct descendant in the DOM.
            this.setState(prevState => ({
            clicks: prevState.clicks + 1
            }));
        }

        render() {
            return (
            <div onClick={this.handleClick}>
                <p>Number of clicks: {this.state.clicks}</p>
                <p>
                Open up the browser DevTools
                to observe that the button
                is not a child of the div
                with the onClick handler.
                </p>
                <Modal>
                <Child />
                </Modal>
            </div>
            );
        }
        }

        function Child() {
        // The click event on this button will bubble up to parent,
        // because there is no 'onClick' attribute defined
        return (
            <div className="modal">
            <button>Click</button>
            </div>
        );
        }

        ReactDOM.render(<Parent />, appRoot);

在上面的HTML结构中，通过Portal, 在Button真实位置是包含在“modal-root”下，但是因为在HTML的结构中Button所在的父节点的HTML结构是包含“app-root”中的，因此在“modal-root”中出发的事件，也可以冒泡到“app-root”中。
