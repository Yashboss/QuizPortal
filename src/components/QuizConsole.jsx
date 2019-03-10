import React, { Component } from "react";
import CircularProgressbar from "react-circular-progressbar";
import * as firebase from "firebase";
import BrandHeader from "./brandHeader";
import wait from '../image/quiz.png'

const needDominantBaselineFix = true;

class QuizConsole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
      timer: "15",
      liveQuestion: 0,
      question: "",
      correctAnswer: "",
      optiona: "",
      optionb: "",
      optionc: "",
      optiond: "",
      answer: "",
      counter: 1,
      score: 0,
      loading: false,
      killtime: false,
      afterAns : 'false'
    };
  }

  componentDidMount = () => {
    this.liveQuestionSetter();

    
    
    //Detecting change in liveQuestion variable in real time database
    this.setState({loading: true})
    this.props.firebaseRef.on("value", (snapshot) =>{
     
      if (snapshot.exists()) {

        this.setState({liveQuestion: snapshot.val().liveQuestion})
      

        this.currentQuestion();

        //This is for enabling quiz page when new question arrives
        
        let firebaseUserInfo = firebase.database().ref(`players/${this.props.teamName}`);
        firebaseUserInfo.once("value", (snapshot)=> {
         this.setState({ counter : snapshot.val().counter})
        });

        

        if (snapshot.val().globalCounter === 1 && this.state.counter === 2) {
         this.setState({afterAns: false})
          let firebaseResetCounter = this.props.database.ref(`players/${this.props.teamName}`);
          firebaseResetCounter.child("counter").set(0);
        }

        if(this.state.counter===0)
        {
          var time=15;
          var perc=0;
  
  
  var mytimer = setInterval(()=>{
    time=time-1;
    perc+=6.66666666666666666;
    if(perc>99){
    killTimer();
    this.setState({counter: 2})
    }
    if(time<10)
    time = '0'+time;
    this.setState({timer: time,
      percentage: perc})
  }, 1000);


var killTimer=()=>{
  clearInterval(mytimer)
}
        }

        this.setState({loading: false,})
          
      }
    });
    let firebaseUserInfo = this.props.database.ref(`players/${this.props.teamName}`);
          firebaseUserInfo.once('value', (snapshot)=> {
              let userCounterCheck = snapshot.val().counter;
              if(userCounterCheck===2){
              this.setState({afterAns: true,
              counter: 2})
              console.log(this.state.counter)}
          })
  };
   


//function to increase option selected count
optionUpdate(liveQues, option) {
  let firebaseQuestionFind2 = this.props.database.ref(`question/q${liveQues}`);

  let optionACounter;
  let optionBCounter;
  let optionCCounter;
  let optionDCounter;
  firebaseQuestionFind2.once('value', (snapshot)=> {
      optionACounter = snapshot.val().optionACounter;
      optionBCounter = snapshot.val().optionBCounter;
      optionCCounter = snapshot.val().optionCCounter;
      optionDCounter = snapshot.val().optionDCounter;
  })

  if (option === 'a') {
      optionACounter = optionACounter + 1;
      firebaseQuestionFind2.child('optionACounter').set(optionACounter);
  }

  if (option === 'b') {
      optionBCounter = optionBCounter + 1;
      firebaseQuestionFind2.child('optionBCounter').set(optionBCounter);
  }

  if (option === 'c') {
      optionCCounter = optionCCounter + 1;
      firebaseQuestionFind2.child('optionCCounter').set(optionCCounter);
  }

  if (option === 'd') {
      optionDCounter = optionDCounter + 1;
      firebaseQuestionFind2.child('optionDCounter').set(optionDCounter);
  }
}




hitTimer(swi){
  
 
};

//function to find the question string for the live question
 currentQuestion() {

  let firebaseQuestionFind = this.props.database.ref(`question/q${this.state.liveQuestion}`);

  let questionToBeDisplayed;
  let answerToBeDisplayed;
  let optionA,optionB,optionC,optionD;
  firebaseQuestionFind.once('value', (snapshot) =>{
      questionToBeDisplayed = snapshot.val().q;
      answerToBeDisplayed = snapshot.val().a;
      optionA = snapshot.val().optionA;
      optionB = snapshot.val().optionB;
      optionC = snapshot.val().optionC;
      optionD = snapshot.val().optionD;
      
  });

  this.setState({
    question: questionToBeDisplayed,
    correctAnswer: answerToBeDisplayed,
    optiona: optionA,
    optionb: optionB,
    optionc: optionC,
    optiond: optionD,

  })
}

   check(event) {

    let option=event.target.id;
    this.setState({
      answer: option,
    })
      //correcting the user's option
      this.props.firebaseRef.once('value', (snapshot) =>{
          let actualAns = this.state.correctAnswer;
          this.setState({
            liveQuestion: snapshot.val().liveQuestion
          })
          let score;
          let userCounterCheck;
          let firebaseUserInfo = this.props.database.ref(`players/${this.props.teamName}`);
          firebaseUserInfo.once('value', (snapshot)=> {
              score = snapshot.val().score;
              userCounterCheck = snapshot.val().counter;
          })
  
          if (userCounterCheck !== 2) {
              this.props.firebaseRef.once('value', (snapshot)=> {
                  this.setState({liveQuestion: snapshot.val().liveQuestion})
                  this.optionUpdate(this.state.liveQuestion, option);
              })

              
          }
          
  
          if (actualAns === option && userCounterCheck !== 2) {
              
              let startTimeStamp = snapshot.val().timeStamp;
              let currentTime = new Date().getTime();
              let timeElapsed =  Math.round((currentTime-startTimeStamp)/1000);
              let newScore = score + (50-timeElapsed);
              let firebaseChangeScore = firebase.database().ref(`players/${this.props.teamName}`);
              firebaseChangeScore.child("score").set(newScore);
          }
  
          
          let firebaseChangeCounter2 = firebase.database().ref(`players/${this.props.teamName}`);
          firebaseChangeCounter2.child('counter').set(2);
      })
  }

  //Onload function to display current live question
   liveQuestionSetter() {
    this.props.firebaseRef.once("value", (snapshot)=> {
      let liveQues = snapshot.val().liveQuestion;
      this.setState({ liveQuestion: liveQues});
      this.currentQuestion();
    });
  }
  renderTimer(){
    if(this.state.counter!==2)
    return(
    <CircularProgressbar
                className="timerCircle"
                percentage={this.state.percentage}
                text={
                  <tspan
                    dx={needDominantBaselineFix ? -25 : 0}
                    dy={needDominantBaselineFix ? +6 : 0}>
                     00:{this.state.timer}
                   </tspan>
                }
                background="true"
                backgroundPadding={0}
                strokeWidth={5}
                styles={{
                  // Customize the root svg element
                  root: {},
                  // Customize the path, i.e. the "completed progress"
                  path: {
                    // Path color
                    stroke: `rgba(250, 0, 250, ${100 / 100})`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: "butt",
                    // Customize transition animation
                    transition: "stroke-dashoffset 0.5s ease 0s"
                  },
                  // Customize the circle behind the path, i.e. the "total progress"
                  trail: {
                    // Trail color
                    stroke: "#d6d6d6"
                  },
                  // Customize the text
                  text: {
                    // Text color
                    fill: "#34c",
                    // Text size
                    fontSize: "20px"
                  },
                  // Customize background - only used when the `background` prop is true
                  background: {
                    fill: "white"
                  }
                }}
              />)

             return(<div></div>) 
  }
  renderQuestion(){
    if(this.state.counter===2)
    return(
      <div><img id="waitImg"
        src={wait} alt="namilehai"/></div>
    )
    
    return(
      <div>
      <p className="Question">
            {this.state.question}
          </p>
          <br />
          <div id="options" className="Options text-center">
          <div className="row container optionGrp justify-content-center ">
          <div id="a" className="tag col-lg-5 text-center" onClick={this.check.bind(this)}>{this.state.optiona}</div>
        <div id="b" className="tag col-lg-5 text-center" onClick={this.check.bind(this)}>{this.state.optionb}</div>
          </div>
<br/>
        <div className="row container optionGrp justify-content-center" id="options">
          <div id="c" className="tag col-lg-5" onClick={this.check.bind(this)}>{this.state.optionc}</div>
        <div id="d" className="tag col-lg-5" onClick={this.check.bind(this)}>{this.state.optiond}</div>
          </div>
          
          </div>
          </div>
    )
  }

 

  render() {
    return (
      <div>
        <BrandHeader
          teamName={this.props.teamName}
          participantName={this.props.participantName}
        />
        <div className="QuestionPage container">
          <div className="text-centre justify-content-center row">
            <p
              className="questionNumber tag"
              style={{ justifyContent: "center" }}
            >
              Quesetion {this.state.liveQuestion} of 10
            </p>
          </div>
          <br />
          {this.renderQuestion()}
          <br />
          <div className="row">
            <div className="col-sm-5" />
            <div className="timer col-sm-4">
              {this.renderTimer()}
            </div>

            
          </div>
        </div>
      </div>
    );
  }
}

export default QuizConsole;
