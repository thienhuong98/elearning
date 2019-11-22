import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions, deleteQuestion } from '../../../actions/admin/questions';
import { changeLoadingStatus } from '../../../actions/app';
import { Link } from 'react-router-dom';
import Paginator from '../partials/Paginator';
import queryString from 'query-string';
import swal from 'sweetalert';

export default function Questions_Index(props) {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const questionsData = useSelector(state => state.admin.questions);

  const [orderValue, setOrderValue] = useState("asc");
  const [searchValue, setSearchValue] = useState("");
  const [perPageValue, setPerPageValue] = useState(5);

  // Goi sau khi load trang (~ ComponentDidMount)
  useEffect(() => {
    document.title = 'Questions';
    //console.log(props.history.location.search)
    return () => {
      dispatch(changeLoadingStatus(true));
    }
  }, []);

  // Goi khi auth co su thay doi
  useEffect(() => {
    // Neu da xac thuc user hop le
    if (auth.isLoggedIn == true) {
      // Lay danh sach categories
      dispatch(getQuestions(getQueries()))
    }
    else if (auth.isLoggedIn == false) {
      // Xac thuc that bai, chuyen huong den trang chinh
      props.history.push(process.env.REACT_APP_ROOT_URL);
    }
  }, [auth.isLoggedIn]);

  // Goi khi questionsData co su thay doi
  useEffect(() => {
    // Neu load thanh cong 
    if (questionsData.data.status != "") {
      dispatch(changeLoadingStatus(false));
    }
  }, [questionsData]);

  // Goi khi URL co su thay doi
  useEffect(() => {
    // Lay lai du lieu khi co su thay doi params
    var queries = getQueries();
    // Set lai State
    setSearchValue(queries.search ? queries.search : "");
    setOrderValue(queries.order ? queries.order : "asc");
    setPerPageValue(queries.per_page ? queries.per_page : 5);

    dispatch(getQuestions(queries))
  }, [props.history.location.search]);

  const getQueries = () => {

    var query = queryString.parse(props.location.search, { ignoreQueryPrefix: true });
    var queries = {};
    queries["search"] = query.search ? query.search : "";
    queries["page"] = query.page ? query.page : 1;
    queries["order"] = query.order ? query.order : "asc";
    queries["per_page"] = query.per_page ? query.per_page : 5;
    return queries;
  }

  const searchHandler = (e) => {
    var queries = getQueries();
    queries["search"] = e.target.value;
    queries["page"] = 1;
    props.history.push({
      search: "?" + new URLSearchParams(queries).toString()
    });
  }

  const orderHandler = (e) => {
    var queries = getQueries();
    queries["order"] = e.target.value;
    props.history.push({
      search: "?" + new URLSearchParams(queries).toString()
    });
  }

  const perPageHandler = (e) => {
    var queries = getQueries();
    queries["per_page"] = e.target.value;
    props.history.push({
      search: "?" + new URLSearchParams(queries).toString()
    });
  }

  const deleteItem = (id) => {
    console.log("ID la " + id)
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this question?",
      icon: "warning",
      buttons: ["Cancel", "Delete it!"],
      dangerMode: true,
    })
    .then((willLogout) => {
      if (willLogout) {
          var token = localStorage.getItem("token");
          dispatch(deleteQuestion(token, id));
      }
    });
  }
  return (
    <div className="container-fluid">
      <h1>Questions</h1>
      <div className="row justify-content-between mt-4">
        <Link to="/admin/categories/new" className="btn btn-outline-success">New Question</Link>
        <div className="row align-items-center">
          <div className="col-auto">
            <input type="text" className="form-control mr-3 d-inline" placeholder="For example: a mind..." value={searchValue} onChange={searchHandler} title="Search Category"/>
          </div>
          <div className="col-auto">
            <select className="custom-select mr-3 d-inline" value={orderValue} onChange={orderHandler} title="Order">
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </div>
          <div className="col-auto">
            <select className="custom-select d-inline" value={perPageValue} onChange={perPageHandler} title="Item per page">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <div className="table-responsive mt-3">
          <div className="text-info mb-2 h5"> 
            Showing { questionsData.data.list.length } of { questionsData.data.paginate.total_item } items
          </div>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Content</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                questionsData.data.list && questionsData.data.list.map((i, key) =>
                  <tr key={key}>
                    <td scope="row">{key+1}</td>
                    <td>{i.id}</td>
                    <td>{i.question_content}</td>
                    <td>
                      <Link to={"admin/questions" + i.id} className="mr-3" title="Show"><i class="far fa-eye" style={{ fontSize: "1.3rem",color:"#007bff" }}></i></Link>
                      <Link to={"admin/questions" + i.id + "/edit"} className="mr-3" title="Edit"><i class="far fa-edit" style={{ fontSize: "1.3rem",color:"#ffc107" }}></i></Link>
                      <Link to={"admin/questions" + i.id + "/delete"} className="" onClick={() => { deleteItem(i.id) }} title="Delete"><i class="far fa-trash-alt" style={{ fontSize: "1.3rem",color:"#dc3545" }}></i></Link>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
          <Paginator paginate={questionsData.data.paginate} queries={getQueries()} />
        </div>
      </div>
    </div>
  )
}