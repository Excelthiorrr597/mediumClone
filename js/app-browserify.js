// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher'),
	Backbone = require('backbone'),
	React = require('react'),
	Button = require('react-button'),
	Parse = require('parse')

console.log('loaded javascript')

var APP_ID = 'KC3i5dxIw2AfhGrolMx0mspMpueAGB5WqOdijqzZ',
	JS_KEY = 'K762D3wZcrAzF3D0P7mlGKjeyF4OwQTuQUdVQ9yj',
	REST_API = 'lKahplMmgvTTiO1NAy0PPGmqC5ppKgtmkLtuKyFp'

Parse.initialize(APP_ID,JS_KEY)

var SignInView = React.createClass({

	render: function(){
		return (
			<div id='signInView'>
				<div id='signIn'>Welcome! Please Sign Up/Log In!</div>
				<SignUpView sendSignUp={this.props.sendSignUp}/>
				<LogInView sendLogIn={this.props.sendLogIn}/>
			</div>)
	}
})

var SignUpView = React.createClass({

	_getSignUpParams: function(event){
		if (event.which === 13) {
			var username = this.refs.usernameSignUp.getDOMNode().value,
				password = event.target.value

			this.props.sendSignUp(username,password)
		}

	},

	render: function() {
		return (
			<div id='signUpView'>
				<p id='signUp'>Sign Up</p>
				<input type="text" placeholder="Enter User Name" ref="usernameSignUp"/>
				<input type="password" placeholder="Enter Password" onKeyPress={this._getSignUpParams}/>
			</div>
			)
	}
})

var LogInView = React.createClass({

	_getLogInParams: function(event){
		if (event.which === 13) {
			var username = this.refs.usernameLogIn.getDOMNode().value,
				password = event.target.value

			this.props.sendLogIn(username,password)
		}

	},

	render: function() {
		return (
			<div id='logInView'>
				<p>Enter Log In Information</p>
				<input type="text" placeholder="Enter User Name" ref="usernameLogIn"/>
				<input type="password" placeholder="Enter Password" onKeyPress={this._getLogInParams}/>
			</div>
			)

	}
})

var MediumRouter = Backbone.Router.extend({

	routes: {
		'login': 'showSignInView',
		'*anyroute': 'showSignInView'
	},

	processLogInInfo: function(username,password){
		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		newUser.logIn().then(function(){
			console.log('successfully logged in')
		})

	},

	processSignUpInfo: function(username,password){
		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		newUser.signUp().then(function(){
			console.log('successfully signed up')
		})
	},

	showSignInView: function(){
		React.render(<SignInView sendSignUp={this.processSignUpInfo} sendLogIn={this.processLogInInfo}/>, document.querySelector('#container'))
	},

	initialize:function(){
		console.log('initialized router')
		if (!Parse.User.current()) {
			location.hash = 'login'
		}
	}
})


var mdRtr = new MediumRouter()
Backbone.history.start()