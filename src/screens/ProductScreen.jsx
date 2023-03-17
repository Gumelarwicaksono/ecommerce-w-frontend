import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import LodingBox from '../components/LodingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const data = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const res = await axios.get(`${api}/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    data();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${api}/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };
  return loading ? (
    <LodingBox />
  ) : error ? (
    <MessageBox className="alert alert-danger">{error}</MessageBox>
  ) : (
    <div>
      <div className="row">
        <div className="col-md-6 my-3">
          <img className="w-100" src={product.image} alt={product.name} />
        </div>
        <div className="col md-3">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
            </li>
            <li className="list-group-item">
              <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
            </li>
            <li className="list-group-item">price : ${product.price}</li>
            <li className="list-group-item">Description : {product.description}</li>
          </ul>
        </div>
        {/* col 3 */}
        <div className="col md-3">
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="row">
                    <div className="col">price :</div>
                    <div className="col">${product.price}</div>
                  </div>
                  <div className="row">
                    <div className="col ">status :</div>
                    <div className="col">{product.countInStock > 0 ? <span className="badge text-bg-success">In Stock</span> : <span className="badge text-bg-danger">Unavailable</span>}</div>
                  </div>
                </li>
                {product.countInStock > 0 && (
                  <li className="list-group-item">
                    <div className="d-grid">
                      <button onClick={addToCartHandler} className="btn btn-primary">
                        add to card
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
