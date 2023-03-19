import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

const ProtectedRoute = (props) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? props.children : <Navigate to={`/login`} />;
};

export default ProtectedRoute;
