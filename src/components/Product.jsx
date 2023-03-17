import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Store } from '../Store';
import Rating from './Rating';

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${api}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  return (
    <div className="product card" key={product.slug}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.slug}`}>
          <div className="card-title">{product.name}</div>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="card-text">$ {product.price}</div>
        {product.countInStock === 0 ? (
          <button className="btn btn-primary" disabled>
            Out Of Stock
          </button>
        ) : (
          <button onClick={() => addCartHandler(product)} className="btn btn-primary">
            {' '}
            add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
