import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { api } from '../api';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LodingBox from '../components/LodingBox';
import MessageBox from '../components/MessageBox';

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
  }, []);

  return (
    <div>
      <Helmet>
        <title>ecomerce-w</title>
      </Helmet>
      <h1>featured products</h1>
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
