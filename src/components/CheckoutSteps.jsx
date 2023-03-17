import React from 'react';

const CheckoutSteps = (props) => {
  return (
    <div className="row checkout-steps">
      <div className={`col ${props.step1 ? 'active' : ''}`}>login</div>
      <div className={`col ${props.step2 ? 'active' : ''}`}>Shipping</div>
      <div className={`col ${props.step3 ? 'active' : ''}`}>payment</div>
      <div className={`col ${props.step4 ? 'active' : ''}`}>place Order</div>
    </div>
  );
};

export default CheckoutSteps;
