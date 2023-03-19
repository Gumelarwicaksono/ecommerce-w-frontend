import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { api } from '../api';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LodingBox from '../components/LodingBox';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  const [categories, setCategories] = useState([]);
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const data = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await axios.get(`${api}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    data();
    // ================
    const fetchCategories = async () => {
      const { data } = await axios.get(`${api}/api/products/categories`);
      setCategories(data);
      try {
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);
  // ===============================

  const style = {
    '--bs-btn-padding-y': '.25rem',
    '--bs-btn-padding-x': '.5rem',
    '--bs-btn-font-size': '.78rem',
  };

  return (
    <div>
      <Helmet>
        <title>ecomerce-w</title>
      </Helmet>
      {/* =============================================== */}
      <div className="container">
        <div className="row ms-5 mt-3">
          <h3 className="text-primary">Products</h3>
          <h5>category :</h5>
          <div className="col ">
            {categories.map((category) => (
              <Link key={category} to={`search?category=${category}`}>
                <button className="btn btn-secondary  rounded-5 m-1 " style={style}>
                  {category}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="products">
        {loading ? (
          <LodingBox />
        ) : error ? (
          <MessageBox className="danger">{error}</MessageBox>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product.slug} className=" col-sm-6 col-md-4 col-lg-3">
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
