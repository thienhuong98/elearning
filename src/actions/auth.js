import axios from 'axios';
import {toastr} from 'react-redux-toastr';

export const userPostFetch = user => {
    return dispatch => {
        return axios.post(process.env.REACT_APP_API_URL + 'api/signup', { "user": user })
        .then(res => {
            //console.log(res);
            if(res.status == 200)
            {
                var d = res.data;
                console.log(d);
                if(d.status == "success")
                {                   
                    localStorage.setItem("token", d.user.authentication_token);
                    toastr.success("Signed Up Successfully!");
                    dispatch(loginUser(d));
                }
                else
                {
                    var keys = Object.keys(d.message);
                    console.log("Key: " + keys);
                    for(var i = 0; i < keys.length; i++)
                    {
                        var msg = "";
                        console.log("Length: " + d.message[keys[i]].length)
                        for(var j = 0; j < d.message[keys[i]].length; j++)
                        {
                            var nameCapitalized = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);
                            msg += nameCapitalized + " " + d.message[keys[i]][j] + ". ";
                        }
                        toastr.error("Failed to Sign Up!", msg);
                    }
                        //toastr.error("Failed to Sign Up!", d.message);
                    dispatch(registrationFailed({"message": d.message}));
                }
            }
            else
            {
                var msg = "There was an error while trying to send data to the server! Error code: "+ res.status;
                toastr.error("Failed to Sign Up!", msg);
                dispatch(registrationFailed({"message": msg}));
                console.log("Không thể kết nối đến server! Mã lỗi: " + res.status);
            }
        })
        .catch(error => console.log(error));
    }
}

export const userLoginFetch = user => {
    return dispatch => {
        return axios.post(process.env.REACT_APP_API_URL + 'api/login', { "user": user })
        .then(res => {
            //console.log(res);
            if(res.status == 200)
            {
                var d = res.data;
                //console.log("Du lieu cua d: " + JSON.stringify(d))
                if(d.status == "success")
                {                   
                    localStorage.setItem("token", d.user.authentication_token);
                    toastr.success(d.message);
                    dispatch(loginUser(d));
                }
                else
                {
                    var msg = d.message.charAt(0).toUpperCase() + d.message.slice(1);
                    toastr.error(msg);
                    dispatch(loginFailed({"message": d.message}));
                }
            }
            else
            {
                var msg = "There was an error while trying to send data to the server! Error code: "+ res.status;
                toastr.error(msg);
                dispatch(loginFailed({"message": msg}));
                console.log(msg);
            }
        })
        .catch(error => console.log(error));
    }
}

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    requestResponse: {
        status: 'success',
        message: userObj.message
    },
    currentUser: userObj.data
});
const registrationFailed = data => ({
    type: 'REGISTRATION_FAILED',
    requestResponse: {
        status: 'success',
        message: data.message
    }
});
const loginFailed = data => ({
    type: 'LOGIN_FAILED',
    requestResponse: {
        status: 'success',
        message: data.message
    }
});
