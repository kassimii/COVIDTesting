import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import {
  listUsers,
  deleteUser,
  createUser,
} from '../redux/actions/userActions';
import { USER_CREATE_RESET } from '../redux/constants/userConstants';

const UserListPage = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = userDelete;

  const userCreate = useSelector((state) => state.userCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = userCreate;

  useEffect(() => {
    dispatch({ type: USER_CREATE_RESET });
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers(pageNumber));
    } else {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/utilizatori/${createUser._id}/editare`);
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Utilizatori</h1>
        </Col>
        <Col className='text-right'>
          <LinkContainer to={`/admin/utilizatori/adaugare`}>
            <Button className='my-3'>
              <i className='fas fa-plus' /> Adaugă utilizator
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='error'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='error'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='error'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NUME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>PRELEVARE</th>
                <th>LABORATOR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin && (
                      <CheckCircleIcon style={{ color: 'green' }} />
                    )}
                  </td>
                  <td>
                    {user.isPrelevationWorker && (
                      <CheckCircleIcon style={{ color: 'green' }} />
                    )}
                  </td>
                  <td>
                    {user.isLabWorker && (
                      <CheckCircleIcon style={{ color: 'green' }} />
                    )}
                  </td>

                  <td>
                    <LinkContainer
                      to={`/admin/utilizatori/${user._id}/editare`}
                    >
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </LinkContainer>
                    <IconButton onClick={() => deleteHandler(user._id)}>
                      <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} scope='users' />
        </>
      )}
    </>
  );
};

export default UserListPage;
