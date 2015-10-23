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
window.p = Parse

//=============Collecions and Models=============//

var PostModel = Backbone.Model.extend({
	url: "https://api.parse.com/1/classes/Posts",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API
	}
})

var PostCollection = Backbone.Collection.extend({
	url: "https://api.parse.com/1/classes/Posts",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API
	},

	model: PostModel,

	parse: function(responseData) {
		return responseData.results
	}
})

//==============SIGN UP PAGE===============//

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

//=================HOME PAGE=================//

var HomeView = React.createClass({

	componentDidMount: function(){
		var self = this
		this.props.collection.on('sync change', 
			function(){
				console.log(self.props.collection)
				self.forceUpdate()
			})
	},

	componentWillUnmount: function(){
		var self = this
		this.props.collection.off('sync change', 
			function(){
				self.forceUpdate()
			})
	},

	_handleEnter: function(event){
		if (event.which === 13) {
			event.preventDefault()
			var message = event.target.innerHTML
			event.target.innerHTML = ''
			this.props.deliverMessage(message)
		}
	},

	_logOut:function(){
		location.hash = 'logOut'
	},

	_showUserPosts: function(){
		location.hash = 'user'
	},

	render: function(){
		var style = {
			'backgroundColor':'white'
		},
		style2 = {
			'backgroundColor':'white',
			'marginBottom':'20px'
		}

		return (
			<div>
				<div id="viewButtons">
					<Button onClick={this._logOut} label='Log Me Out!' style={style}/>
				</div>
				<div 
					id="messageContainer" 
					contentEditable='true' 
					onKeyPress={this._handleEnter}
					>
				</div>
				<div id="viewButtons">
					<Button onClick={this._showUserPosts} label='View Your Posts!' style={style2}/>
				</div>
				<PostBox collection={this.props.collection}/>
			</div>
			)
	}
})

var PostBox = React.createClass({

	_genPosts: function(postObj) {
		return (<Posts key={postObj.id} model={postObj}/>)
	},

	render: function() {
		return (
			<div id="postContainer">
				{this.props.collection.map(this._genPosts)}
			</div>
			)
	}
})

var Posts = React.createClass({

	render: function(){
		var message = this.props.model.attributes.content

		return (
			<div id="individualPosts">
				{message}
			</div>
			)
	}
})

//=================USER VIEW================//

var UserView = React.createClass({

	componentDidMount: function(){
		var self = this
		this.props.collection.on('sync change', 
			function(){
				console.log(self.props.collection)
				self.forceUpdate()
			})
	},

	componentWillUnmount: function(){
		var self = this
		this.props.collection.off('sync change', 
			function(){
				self.forceUpdate()
			})
	},

	_handleEnter: function(event){
		if (event.which === 13) {
			event.preventDefault()
			var message = event.target.innerHTML
			event.target.innerHTML = ''
			this.props.deliverMessage(message)
		}
	},

	_goHome:function(){
		location.hash = 'home'
	},

	render: function(){
		var style = {
			'backgroundColor':'white'
		}

		return (
			<div>
				<div id="viewButtons">
					<Button onClick={this._goHome} label='Go Back Home!' style={style}/>
				</div>
				<div 
					id="messageContainer" 
					contentEditable='true' 
					onKeyPress={this._handleEnter}
					>
				</div>
				<PostBox collection={this.props.collection}/>
			</div>
			)
	}
})

// var PostBox = React.createClass({

// 	_genPosts: function(postObj) {
// 		return (<Posts key={postObj.id} model={postObj}/>)
// 	},

// 	render: function() {
// 		return (
// 			<div id="postContainer">
// 				{this.props.collection.map(this._genPosts)}
// 			</div>
// 			)
// 	}
// })

// var Posts = React.createClass({

// 	render: function(){
// 		var message = this.props.model.attributes.content

// 		return (
// 			<div id="individualPosts">
// 				{message}
// 			</div>
// 			)
// 	}
// })

//===================ROUTER==================//

var MediumRouter = Backbone.Router.extend({

	routes: {
		'home': 'showHomeView',
		'logOut': 'logOut',
		'login': 'showSignInView',
		'user': 'showUserView'
	},

	deliverMessage: function(message){
		var pm = new PostModel()
		pm.set({
			content: message,
			userid: Parse.User.current().id
		})
		this.pc.add(pm)
		pm.save(null,{
			headers: pm.parseHeaders
		})
	},

	logOut: function(){
		Parse.User.logOut().then(function(){
			location.hash = 'login'
		})
		this.pc.reset()
	},

	processLogInInfo: function(username,password){
		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		newUser.logIn().then(function(){
			location.hash = 'home'
		})
	},

	processSignUpInfo: function(username,password){
		var newUser = new Parse.User()
		newUser.set('username',username)
		newUser.set('password',password)
		console.log(username)
		newUser.signUp().then(function(){
			location.hash = 'home'
		})
	},

	showHomeView: function() {
		console.log('showing home view')
		this.pc.fetch({
			headers: this.pc.parseHeaders,
			processData: true,
		})
		React.render(<HomeView deliverMessage={this.deliverMessage.bind(this)} collection={this.pc}/>,document.querySelector('#container'))
	},

	showSignInView: function(){
		React.render(<SignInView sendSignUp={this.processSignUpInfo} sendLogIn={this.processLogInInfo}/>,document.querySelector('#container'))
	},

	showUserView: function() {
		console.log('showing user view')
		var paramObj = {
			userid: Parse.User.current().id
		}
		var stringifiedParams = JSON.stringify(paramObj)

		this.pc.fetch({
			headers: this.pc.parseHeaders,
			processData: true,
			data: {
				where: stringifiedParams
			}
		})
		React.render(<UserView deliverMessage={this.deliverMessage.bind(this)} collection={this.pc}/>,document.querySelector('#container'))
	},

	initialize:function(){
		console.log('initialized router')
		this.pc = new PostCollection()
		if (!Parse.User.current()) {
			location.hash = 'login'
		}
	}
})

var mdRtr = new MediumRouter()
Backbone.history.start()
