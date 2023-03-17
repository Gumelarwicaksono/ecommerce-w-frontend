import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import LodingBox from '../components/LodingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
};

const OrderScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // function create order in btn paypal
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  // function on aprova
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(`${api}/api/orders/${order._id}/pay`, details, { headers: { authorization: `Bearer ${userInfo.token}` } });
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is Paid');
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: getError(error) });
        toast.error(getError(error));
      }
    });
  }
  //   funtion error
  function onError(error) {
    toast.error(getError(error));
  }
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${api}/api/orders/${orderId}`, { headers: { authorization: `Bearer ${userInfo.token}` } });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(`${api}/api/keys/paypal`, { headers: { authorization: `Bearer ${userInfo.token}` } });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);
  return loading ? (
    <LodingBox />
  ) : error ? (
    <MessageBox className="bg-danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order</title>
      </Helmet>
      <h1 className="my-3">Order</h1>
      <div className="row">
        <div className="col col-md-8">
          {/* sipping */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Shipping</h5>
              <p className="cart-text">
                <strong>Name :</strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>Address :</strong>
                {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},{order.shippingAddress.country}
              </p>
              {order.isDelivered ? <MessageBox className="success">Delivered At {order.deliveredAt}</MessageBox> : <MessageBox className="danger">Not Delivered</MessageBox>}
            </div>
          </div>
          {/* payment */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Payment</h5>
              <p className="card-text">
                <strong>Method :</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? <MessageBox className="success">Paid At {order.paidAt}</MessageBox> : <MessageBox className="danger">Not Paid</MessageBox>}
            </div>
          </div>
          {/* items */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="cart-title">Items</h5>
              <div className="list-group list-group-flush">
                {order.orderItems.map((item) => (
                  <div className="list-group list-group-item" key={item._id}>
                    <div className="row align-items-center">
                      <div className="col col-md-6">
                        <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" /> {` `}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="col col-md-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="col col-md-3">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* order summary */}
        <div className="col col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="list-group list-group-flush">
                {/* items */}
                <div className="list-group-item">
                  <div className="row">
                    <div className="col">Items</div>
                    <div className="col">${order.itemsPrice.toFixed(2)}</div>
                  </div>
                </div>
                {/* shipping */}
                <div className="list-group-item">
                  <div className="row">
                    <div className="col">Shipping</div>
                    <div className="col">${order.shippingPrice.toFixed(2)}</div>
                  </div>
                </div>
                {/* tax */}
                <div className="list-group-item">
                  <div className="row">
                    <div className="col">Tax</div>
                    <div className="col">${order.taxPrice.toFixed(2)}</div>
                  </div>
                </div>
                {/* total */}
                <div className="list-group-item">
                  <div className="row">
                    <div className="col">
                      <strong>Order Total</strong>
                    </div>
                    <div className="col">
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
                <div className="list-group-item">
                  {!order.isPaid && (
                    <div>
                      {isPending ? (
                        <LodingBox />
                      ) : (
                        <div>
                          <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                          {loadingPay && <LodingBox />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
