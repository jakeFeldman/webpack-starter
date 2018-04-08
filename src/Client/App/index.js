// PACKAGES
import React, { Component } from 'react';
// STYLES
import css from 'Styles/app.scss';

export default class App extends Component {
    /**************************************************************
     * RENDERING
     *************************************************************/
    render () {
        return (
            <div className={css.container}>
                <h1 className={`${css.header} ${css.textHeader}`}>React App Starter</h1>
            </div>

        );
    }
}
