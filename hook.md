# 16.8.2版本新增加功能

作用： fn声明组件时，可以通过hooks提供的接口，修改组件的状态，提供类似生命周期的函数。（hook不可在class组件中使用）

## API

### useState

使用useState项为function components添加状态：

        import React, { useState } from 'react';

        function Example() {
        // Declare a new state variable, which we'll call "count"
        const [count, setCount] = useState(0);

        return (
            <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            </div>
        );
        }
> 注意: useState不会像setState那样自动的合并更新对象
> 初始状态只会在初始render时传入，之后render中都会被忽略。


### useEffect 

每次渲染后调用useEffect中传入的函数

    import React, { useState, useEffect } from 'react';

    function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    });

    return (
        <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
            Click me
        </button>
        </div>
    );
    }

注意：

* useEffect下次渲染后执行传入的函数时，会清空之前注入的函数队列
* 注入函数可以返回一个函数，在组件卸载时调用，类似componentwillUnmout函数里调用

          useEffect(() => {
            ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
            // Specify how to clean up after this effect:
            return function cleanup() {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
            };
        });
* 优化： 只有档传入的数组中的值变化时，effect才会再次调用，数组中的值应该是effect使用到的值；如果传入[]effect只会调用一次

        useEffect(() => {
        document.title = `You clicked ${count} times`;
        }, [count]); // Only re-run the effect if count changes

### useContext

        const context = useContext(Context);

接受Context对象（从React.createContext返回的值）并返回当前Context值。当provider更新时，hook会触发rerender获取最新的context值。


## 使用注意事项

可以使用eslint-plugin-react-hooks检测hooks使用是否符合规则

* 只能在react function 的顶级或者自定义的hook中使用hook，不要再循环（loop）、条件分歧（conditions）或者嵌套的函数中使用hooks。

hook通过注册的顺序，确保数据与设置它的函数一一对应，如果破坏了这种一一对应关系，可能导致状态修改失败

        // 🔴 We're breaking the first rule by using a Hook in a condition
        if (name !== '') {
            useEffect(function persistForm() {
            localStorage.setItem('formData', name);
            });
        }
        // 第一次渲染时， name不为空
        useState('Mary')           // 1. Read the name state variable (argument is ignored)
        // useEffect(persistForm)  // 🔴 This Hook was skipped!
        useState('Poppins')        // 🔴 2 (but was 3). Fail to read the surname state variable
        useEffect(updateTitle)     // 🔴 3 (but was 4). Fail to replace the effect

        // 第二次渲染， name为空。 React不知道第二次useState Hook调用返回什么。 React期望此组件中的第二个Hook调用对应于persistForm，就像在前一个渲染期间一样，但它不再存在。 从那时起，在我们跳过的那个之后的每个下一个Hook调用也会移动一个，导致错误。

如果需要使用条件分歧， 在hook中使用

        useEffect(function persistForm() {
            // 👍 We're not breaking the first rule anymore
            if (name !== '') {
            localStorage.setItem('formData', name);
            }
        });

## 自定义hook，方便复用

自定义hook，可以在多个组件中使用

例如：FriendStatus和FriendListItem组件都想知道，朋友是否上线的信息isOnline 

        // 自定义hook

        import React, { useState, useEffect } from 'react';

        function useFriendStatus(friendID) {
        const [isOnline, setIsOnline] = useState(null);

        function handleStatusChange(status) {
            setIsOnline(status.isOnline);
        }

        useEffect(() => {
            ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
            return () => {
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
            };
        });

        return isOnline;
        }

        // 组件中使用自定义hook

        function FriendStatus(props) {
            const isOnline = useFriendStatus(props.friend.id);

            if (isOnline === null) {
                return 'Loading...';
            }
            return isOnline ? 'Online' : 'Offline';
        }

        function FriendListItem(props) {
            const isOnline = useFriendStatus(props.friend.id);

            return (
                <li style={{ color: isOnline ? 'green' : 'black' }}>
                {props.friend.name}
                </li>
            );
        }

注意事项：

* 自定义hook函数名称必须以'use'开头，告知组件该函数包含了hook调用，组件不会自动检测函数是否调用了hook。
* 组件公用了自定义hook，但是状态是分离的，不会相互影响。