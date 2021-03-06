import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../../actions/auth';
import swal from 'sweetalert';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.logoutUser = this.logoutUser.bind(this);
    }
    logoutUser()
    {
        swal({
            title: "Are you sure?",
            text: "Do you want to logout?",
            icon: "warning",
            buttons: ["Go back", "Log me out!"],
            dangerMode: true,
          })
          .then((willLogout) => {
            if (willLogout) {
                var token = localStorage.getItem("token");
                this.props.logoutUser(token);
            }
          });
        //console.log("Logout User func called")
    }
    renderJSX() {
        if (this.props.isLoggedIn) {
            return (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={ "/" + this.props.currentUser.id + "/newsfeed" } key="News feed"><i className="fas fa-newspaper"></i> News Feed</Link>
                    </li>
                    <li className="nav-item">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-user"></i> { this.props.currentUser.name }
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                { this.props.currentUser.admin && <><Link className="dropdown-item" to="/admin"><i className="fas fa-user-shield"></i> Admin Dashboard</Link> <div className="dropdown-divider"></div></> }
                                <Link className="dropdown-item" to="/profile"><i className="far fa-address-card"></i> Profile</Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/learnt_words"><i className="fab fa-wikipedia-w"></i> Learnt Words</Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" rel="nofollow" to="#" onClick={this.logoutUser}><i className="fas fa-sign-out-alt"></i> Logout</Link>
                            </div>
                        </li>
                    </li>
                </>
            );

        }
        else {
            return (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={{pathname: '/auth/login', state: { prevPath: this.props.history.location.pathname }}} key="Login"><i className="fas fa-sign-in-alt"></i> Login</Link>
                    </li>
                </>
            );
        }
    }
    render() {
        //console.log(this.props)
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link to="/" className="navbar-brand"><i className="fas fa-home"></i> Home</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/categories"><i className="fas fa-atlas"></i> Categories</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {this.renderJSX()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        currentUser: state.auth.currentUser,
        isLoggedIn: state.auth.isLoggedIn
    }
}
const mapDispatchToProps = dispatch => ({
    logoutUser: (token) => dispatch(logoutUser(token))
});
export default connect(mapStateToProps, mapDispatchToProps) (Header);
// export default Header;