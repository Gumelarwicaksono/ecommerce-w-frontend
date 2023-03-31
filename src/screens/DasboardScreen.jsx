import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import TambahProduct from '../components/TambahProduct';

const DasboardScreen = () => {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div id="list-example" className="list-group">
              <Link className="list-group-item list-group-item-action" to="/profile">
                Profile
              </Link>
              <Link className="list-group-item list-group-item-action" to="/admin/dashboard/addproduct">
                Add Products
              </Link>
              <Link className="list-group-item list-group-item-action" to="/updateproduct">
                Update Products
              </Link>
              <Link className="list-group-item list-group-item-action" to="/dasboard">
                Delete Products
              </Link>
            </div>
          </div>

          <div className="col-8">
            <Routes>
              <Route path="/addproduct" element={<TambahProduct />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasboardScreen;
