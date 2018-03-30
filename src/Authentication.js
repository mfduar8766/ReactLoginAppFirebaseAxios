import React, { Component } from 'react';
let firebase = require('firebase');



class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            err: '',
            welcome: '',
            bye: ''
         };
    }

    logIn = (event) => {
        const email = this.refs.email.value;
        const password = this.refs.password.value;
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);

        promise
        .then(user => {
            let welcome = 'Welcome'+ user.email;
            let lgOut = document.getElementById('logout');
            lgOut.classList.remove('hide');
            this.setState({welcome});            
        });
        promise
        .catch(e => {
            let err = e.message;
            this.setState({err});
        });
    }

    signUp = () => {
        const email = this.refs.email.value;
        const password = this.refs.password.value;
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);

        promise
        .then(user => {
            let err = 'Welcome' + user.email;    
            firebase.database().ref('users/' + user.uid).set({
                email: user.email
            });
            this.setState({err});
        });
        promise
        .catch(e => {
            let err = e.message;
            this.setState({err});
        });
    }

    logOut = () => {
        const promise = firebase.auth().signOut();

        promise
        .then(user => {
            let bye = "Thank You for visiting." + this.refs.email.value;
            let lgOut = document.getElementById('logout');
            lgOut.classList.add('hide');
            this.setState({bye});
        });
        promise
        .catch(e => {
            let err = e.message;
            this.setState({err});
        });
    }

    google = () => {
        let provider = new firebase.auth.GoogleAuthProvider();
        let promise = firebase.auth().signInWithPopup(provider); //Popup used for web apps.

        promise
        .then(result => {
            let user = result.user;
            firebase.database().ref('users/' + user.uid).set({
                email: user.email,
                name: user.displayName
            });
        });
        promise
        .catch(e => {
            let err = e.message;
            console.log(err);
        });
    }

    render() { 
        return ( 
        <div>
        <input id="email" ref="email" type="email" placeholder="Enter your Email..."/><br/>
        <input id="pass" ref="password" type="password" placeholder="Enter your Password..."/><br/>
        <p>{this.state.err}</p>   
        <p>{this.state.welcome}</p> 
        <p>{this.state.bye}</p> 
        <button onClick={this.logIn.bind(this)}>Log In</button>
        <button onClick={this.signUp.bind(this)}>Sign Up</button>
        <button className="hide" id="logout" onClick={this.logOut.bind(this)}>Log Out</button><br/>
        <button id="google" className="google" onClick={this.google.bind(this)}>Sign In With Google</button>
        </div>
        );
    }
}
 
export default Authentication;