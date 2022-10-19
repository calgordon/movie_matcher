import React, {Component} from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import InfiniteScrolling from "./components/InfiniteScrolling";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayed_form: '',
            logged_in: localStorage.getItem('token') ? true : false,
            username: '',
            search: ''
        };
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch('http://localhost:8000/api/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({username: json.username});
                });
        }
    }

    handle_login = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.user.username
                });
            });
    };
    handle_signup = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: '',
                    username: json.username
                });
            });
    };
    handle_logout = () => {
        localStorage.removeItem('token');
        this.setState({logged_in: false, username: ''});
    };
    display_form = form => {
        this.setState({
            displayed_form: form
        });
    };

    handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      const newState = { ...prevState };
      newState[name] = value;
      return newState;
    });
  };

    render() {
        let form;
        switch (this.state.displayed_form) {
            case 'login':
                form = <LoginForm handle_login={this.handle_login}/>;
                break;
            case 'signup':
                form = <SignupForm handle_signup={this.handle_signup}/>;
                break;
            case 'library':
                form = <InfiniteScrolling query={this.state.search}/>;
                break;
            default:
                form = null;
        }
        return (
            <div className="App">
                <Nav
                    logged_in={this.state.logged_in}
                    display_form={this.display_form}
                    handle_logout={this.handle_logout}
                />
                <input
                    placeholder='Value for genre search'
                    type='text'
                    name='search'
                    value={this.state.search}
                    onChange={this.handle_change}/>
                {form}
                <h3>
                    {this.state.logged_in
                        ? `Hello, ${this.state.username}`
                        : 'Please Log In'}
                </h3>
            </div>
        );
    }
}

export default App;
    