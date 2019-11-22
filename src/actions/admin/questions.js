import axios from 'axios';
import {toastr} from 'react-redux-toastr';

export const getQuestions = (params) => {
    return dispatch => {
        return axios.get(process.env.REACT_APP_API_URL + 'admin/questions',
                    { params: params}
        )
        .then(res => {
            if (res.status === 200) {
                var d = res.data;
                if (d.status === "success") {
                    dispatch(getListSuccessfully(d.data));
                }
                else
                {
                    var msg = "Couldn't get data from server!" + res.status;
                    toastr.error(msg);
                    dispatch(getListFailed({"message": msg}));
                    console.log(msg);
                }
            }
            else {
                var msg = "Server returned error code: " + res.status;
                toastr.error(msg);
                dispatch(getListFailed({"message": msg}));
                console.log(msg);
            }
        })
        .catch(error => {
            toastr.error("Failed to get data from server!", error);
            console.log(error)
        });
    }
}

export const deleteQuestion = (token, id) => {
    return dispatch => {
        return axios.delete(process.env.REACT_APP_API_URL + 'admin/questions/' + id,
            {
                headers: {
                    "Authorization": token
                }
            }
        )
        .then(res => {
            if (res.status === 200) {
                var d = res.data;
                if (d.status === "success") {
                    toastr.success(d.message);
                    dispatch(deleteQuestionSuccessfully(d.data));
                }
                else
                {
                    var msg = "Couldn't get data from server!" + res.status;
                    toastr.error(msg);
                    dispatch(deleteQuestionsFailed({"message": msg}));
                    console.log(msg);
                }
            }
            else {
                var msg = "Server returned error code: " + res.status;
                toastr.error(msg);
                dispatch(deleteQuestionsFailed({"message": msg}));
                console.log(msg);
            }
        })
        .catch(error => {
            toastr.error("Failed to get data from server!", error);
            console.log(error)
        });
    }
}

const getListSuccessfully = data => ({
    type: 'GET_LIST_SUCCESSFULLY',
    status: 'success',
    data: data
});

const getListFailed = data => ({
    type: 'ADMIN_GET_LIST_FAILED',
    status: 'error',
    message: data
});
const deleteQuestionSuccessfully = data => ({
    type: 'DELETE_QUESTION_SUCCESSFULLY',
    status: 'success',
    message: data
});
const deleteQuestionsFailed = data => ({
    type: 'DELETE_QUESTION_FAILED',
    status: 'error',
    message: data.message
});