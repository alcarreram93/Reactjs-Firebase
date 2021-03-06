import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';
class App extends Component {
constructor(){
  super();
  this.state={
    user:null,
    pictures:[]
  };
  this.handleAuth=this.handleAuth.bind(this);
  this.handleLogout=this.handleLogout.bind(this);
  this.handleUpload=this.handleUpload.bind(this);
}

componentWillMount(){ //listener de firebase para setear valores
  firebase.auth().onAuthStateChanged(user=>{
    this.setState({user});
  });
  firebase.database().ref('pictures').on('child_added',snapshot =>{
    this.setState({
      pictures:this.state.pictures.concat(snapshot.val())
  });
});
}

  handleAuth(){
    const provider=new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log('${result.user.email} HA INICIADO SESION'))
    .catch(error => console.log('Error ${error.code}: ${error.message}'));
  }
  handleLogout(){
    firebase.auth().signOut()
    .then(result => console.log('${result.user.email} HA SALIDO'))
    .catch(error => console.log('Error ${error.code}: ${error.message}'));

  }
  handleUpload(event){
    const file=event.target.files[0];
    const storageRef=firebase.storage().ref(`/fotos/${file.name}`);
    const task=storageRef.put(file);

    task.on('state_changed',snapshot=>{
      let percentage=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
      this.setState({
        uploadValue:percentage
      })
    },error => {
      console.log(error.message);
    },()=>{
      const record={
        photoURL:this.state.user.photoURL,
        displayName:this.state.user.displayName,
        image:task.snapshot.downloadURL
      };
      const dbRef=firebase.database().ref('pictures');
      const newPicture=dbRef.push();
      newPicture.set(record);
  });
  }

  renderLoginButton(){
    //si el ususario esta logueado
    if(this.state.user){
      return (
        <div>
        <img width="100"src={this.state.user.photoURL} alt={this.state.displayName}></img>
        <p>HOLA {this.state.user.displayName}!</p>
        <button onClick={this.handleLogout}>Salir</button>

        <FileUpload onUpload={this.handleUpload}/>
        {
          //recorre arreglo de picture
          this.state.pictures.map(picture =>(
          <div>
          <img width="500" src={picture.image} />
          <br></br>
          <img width="48" src={picture.photoURL} alt={picture.displayName}/>
          <br></br>
          <span> {picture.displayName}</span>
          </div>
        )).reverse()
        }
        </div>
      );
    }
    else {
      return(  <button onClick={this.handleAuth}>Login con Google</button>
      );

    }
    //si esl ususario no esta logueado
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>PseudoGram</h2>
        </div>
        <p className="App-intro">
        {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
