import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Store } from '../Store.js';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const navigate = useNavigate();
  // define redirect
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${api}/api/users/login`, {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div className="container small-container">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h3>Login</h3>
      <form onSubmit={submitHandler}>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        <div className="mb-3">
          New customer? {` `}
          <Link to={`/register?redirect=${redirect}`}>Create your account</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
