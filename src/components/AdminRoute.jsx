import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

const AdminRoute = (props) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return userInfo && userInfo.isAdmin ? props.children : <Navigate to={`/login`} />;
};

export default AdminRoute;
