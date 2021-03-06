const defaultState = {
    data: {
        paginate: {
            last_page: 1,
            first_page: 1,
            current_page: 1,
            previous_page: false,
            next_page: false
        },
        list: []
    },
    status: "",
    message: ""
}

export default function categoriesReducer(state = defaultState, action)
{
    switch (action.type) {
        case 'RETURN_LIST':
            return { ...state, data: action.data, status: action.status }
        case 'GET_LIST_FAILED':
            return { ...state, status: action.status, message: action.message }
        default:
            return state;
    }
}