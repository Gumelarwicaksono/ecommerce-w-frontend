import axios from 'axios';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

const CartScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`${api}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  //   remove cart
  const removeCartHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  //   cekout
  const cekoutHendler = () => {
    navigate('/login?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <div className="row">
        <div className="col-md-8">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty. <Link to={`/`}>Go shoping</Link>
            </MessageBox>
          ) : (
            <div className="list-group">
              {cartItems.map((item) => (
                <div key={item._id} className="list list-group-item">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />
                      {` `} <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </div>
                    <div className="col-md-3">
                      <button onClick={() => updateCartHandler(item, item.quantity - 1)} className="btn btn-light " disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </button>
                      {` `}
                      <span>{item.quantity}</span>
                      {` `}
                      <button onClick={() => updateCartHandler(item, item.quantity + 1)} className="btn btn-light " disabled={item.quantity === item.countInstock}>
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </div>
                    <div className="col-md-3">${item.price}</div>
                    <div className="col-md-2">
                      <button onClick={() => removeCartHandler(item)} className="btn btn-light">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <h3>
                    subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} {` `}items ) : $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </div>
                <div className="list-group-item">
                  <div className="d-grid">
                    <button onClick={cekoutHendler} className="btn btn-primary" disabled={cartItems.length === 0}>
                      proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
