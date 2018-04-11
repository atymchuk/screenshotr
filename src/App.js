import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.Header}>
          <img src={logo} className={styles.Logo} alt="logo" />
          <h1 className={styles.Title}>Welcome to React</h1>
        </header>
        <p className={styles.Intro}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
