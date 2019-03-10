import React, { Component } from 'react';
import * as firebase from 'firebase';
import Loader from 'react-loader-spinner'
import QuizConsole from './components/QuizConsole';
import Logo from './image/hackgridLogo.png';
import './App.css';


var config = {
  apiKey: "AIzaSyBPLVDzn-VHltDnx-dL1e_M_cPIQQqr8P4",
  authDomain: "adgquiz.firebaseapp.com",
  databaseURL: "https://adgquiz.firebaseio.com",
  projectId: "adgquiz",
  storageBucket: "adgquiz.appspot.com",
  messagingSenderId: "838063692472"
};
firebase.initializeApp(config);

const firebaseUser = firebase.database().ref(`players`);
const firebaseRef = firebase.database().ref();
const database = firebase.database();
const firebaseQuestions = firebase.database().ref(`question`);




class App extends Component {
  constructor(props) {
    super(props);

    

    this.state = { 
      loadingSignUp: false,
      registered: false,
      loggedIn: false,
      teamName: '',
      password: '',
      participantName: ''
     }
  }




  renderRegisterOrQuiz(){
    if(this.state.loggedIn)
    return(
      <div> <QuizConsole teamName={this.state.teamName} participantName={this.state.participantName} database={database} user={firebaseUser} firebaseRef={firebaseRef} questions={firebaseQuestions}/></div>
     
    )

    return(
      <form  id="regDeco" className ="register" onSubmit={this.onPressRegisterButton.bind(this)} autoComplete="off">
      <div className="text-center">
        <img src={Logo} alt="logo" id="reglogo"></img>
        <h1>Quiz</h1>
      </div>
          {this.register()}
      </form>
    )
  }

  teamNameOnChange(event){
    this.setState({ teamName: event.target.value,
                    loadingSignUp: true});
    firebaseUser.once('value', (snapshot)=> {
      let players = Object.keys(snapshot.val());
        let userCheck = players.includes(this.state.teamName);
        this.setState({loadingSignUp: false})
       if (userCheck)
       this.setState({registered: true})
       else
       this.setState({registered: false})
    })
    
  }

  participantNameOnChange(event){
    this.setState({participantName: event.target.value});
  }

  passwordOnChange(event){
  
    this.setState({ password: document.getElementById("password").value});
    

  }

  onPressRegisterButton=(event)=>{
    event.preventDefault();
    this.setState({
      teamName: document.getElementById("TeamName").value,
      password: document.getElementById("password").value,
    })
    if(this.state.registered===false)
    {
      firebaseUser.child(this.state.teamName).set({
        password: this.state.password,
        score: 0,
        counter: 0,
      });
      this.setState({registered: true})
    }
    else{
      let finPass = this.state.password;
      let pass='';
      let firebasePassCheck = firebase.database().ref(`players/${this.state.teamName}`);
    firebasePassCheck.once('value', (snapshot)=> {
      pass= snapshot.val().password;

      if(finPass===pass)
      {
        this.setState({
          loggedIn: true,
        })
      }
    });
    
    }
  }

  loginOrRegister(){
    
    if(this.state.registered===false)
    return(
      <div>
      <input type="password" id="password" className="" name="login" placeholder="password" value={this.state.password} onChange={this.passwordOnChange.bind(this)} required/>      
      <br/>
      <input className="btn btn-primary" id="rButton" type="submit" value="Register"/>
      </div>
    )

    return(
      <div>
      <input type="password" id="password" className="" name="login" placeholder="password" value={this.state.password} onChange={this.passwordOnChange.bind(this)} required/>
      <p style={{color: 'blue'}}>Registered</p>      
      <br/>
      <input className="btn btn-primary" id="rButton" type="submit" value="Log In"/>
      </div>
    )
  }

  spinner(){
    if(this.state.loadingSignUp)
    return(
      <Loader
         type="TailSpin"
         color="#00BFFF"
         height="55"	
         width="55"
      /> 
    )
  }

  register(){
    return(
      <div className="registerCard container">
      <input type="text" id="TeamName" className="" name="login" placeholder="Team Name" value={this.state.teamName + ''} autoComplete="off" onChange={this.teamNameOnChange.bind(this)} required/>
      {this.loginOrRegister()}
      </div>
    )
  }

  render() { 
    return ( 
      <div className="App " >
      {this.renderRegisterOrQuiz()}
<br/>
<br/>
<br/>
<div id="loader" className="text-center">{this.spinner()}</div>
      </div>
     );
  }
}
 

export default App;
