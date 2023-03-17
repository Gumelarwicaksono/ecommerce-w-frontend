import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Store } from '../Store.js';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const navigate = useNavigate();
  // define redirect
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('password do not match');
      return;
    }
    try {
      const { data } = await axios.post(`${api}/api/users/register`, {
        name,
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
        <title>Register</title>
      </Helmet>
      <h3>Register</h3>
      <form onSubmit={submitHandler}>
        <div className="mb-3 row">
          <label htmlFor="name" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="name" id="name" onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input type="email" className="form-control" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input type="password" className="form-control" name="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="confirmpassword" className="col-sm-2 col-form-label">
            Confirm Password
          </label>
          <div className="col-sm-10">
            <input type="password" className="form-control" name="confirmpassword" id="confirmpassword" onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            register
          </button>
        </div>
        <div className="mb-3">
          Alredy have an account ? {` `}
          <Link to={`/login?redirect=${redirect}`}>login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterScreen;
