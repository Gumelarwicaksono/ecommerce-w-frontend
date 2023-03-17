import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

const ShippingAdressScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    userInfo,
    cart: { shippingAdress = {} },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const [fullName, setFullName] = useState(shippingAdress.fullName || '');
  const [address, setAddress] = useState(shippingAdress.address || '');
  const [city, setCity] = useState(shippingAdress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAdress.postalcode || '');
  const [country, setCountry] = useState(shippingAdress.country || '');

  //   const [name, setName] = useState('');
  //   const [address, setAddress] = useState('');
  //   const [city, setCity] = useState('');
  //   const [postalcode, setPostalCode] = useState('');
  //   const [country, setCountry] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };
  return (
    <div>
      <Helmet>
        <title>Shiping Adress</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shiping Adress</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="form-label">full Name</label>
            <input type="text" className="form-control" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">city</label>
            <input type="text" className="form-control" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">postal code</label>
            <input type="text" className="form-control" id="postalcode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">country</label>
            <input type="text" className="form-control" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary mb-3">
            continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingAdressScreen;
