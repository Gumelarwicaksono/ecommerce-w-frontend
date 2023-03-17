import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

const PaymentMetodScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMetod] = useState(paymentMethod || 'PayPal');
  const navigate = useNavigate();
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Paymet Metod</title>{' '}
        </Helmet>
        <h1 className="my-3">Payment Metod</h1>
        <form onSubmit={submitHandler}>
          <div className=" mb-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" value="PayPal" id="PayPal" checked={paymentMethodName === 'PayPal'} onChange={(e) => setPaymentMetod(e.target.value)} />
              <label className="form-check-label" htmlFor="PayPal">
                PayPal
              </label>
            </div>
          </div>
          <div className=" mb-4">
            <div className="form-check">
              <input className="form-check-input" type="radio" id="Stripe" value="Stripe" checked={paymentMethodName === 'Stripe'} onChange={(e) => setPaymentMetod(e.target.value)} />
              <label className="form-check-label" htmlFor="Stripe">
                Stripe
              </label>
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMetodScreen;
