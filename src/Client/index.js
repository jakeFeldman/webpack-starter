// PACKAGES
import React from 'react';
import ReactDOM from 'react-dom';
// COMPONENTS
import App from './App';

/**************************************************************
 * RENDERING
 *************************************************************/
function Application () {
    return (
        <App />
    );
}

/**************************************************************
 * MOUNT
 *************************************************************/
ReactDOM.render(<Application />, document.getElementById('root'));
