import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
      apiKey: "AIzaSyDjeyjkFE85Ydjr2vKqGxBOeEiInEjXE-I",
      authDomain: "miproyecto-25889.firebaseapp.com",
      databaseURL: "https://miproyecto-25889.firebaseio.com",
      projectId: "miproyecto-25889",
      storageBucket: "miproyecto-25889.appspot.com",
      messagingSenderId: "903052871677"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
