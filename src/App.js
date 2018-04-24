import React, { Component } from 'react';
import Logo from './logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.Header}>
          <Logo className={styles.Logo} />
          {/* <img src={Logo} className={styles.Logo} alt="logo" /> */}
          <h1 data-testid="h1" className={styles.Title}>Welcome to React</h1>
        </header>
        <p className={styles.Intro}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
