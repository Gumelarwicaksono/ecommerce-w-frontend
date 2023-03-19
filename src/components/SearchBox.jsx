import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="input-group my-3">
          <input type="text" className="form-control" name="query" id="q" placeholder="Search Products..." onChange={(e) => setQuery(e.target.value)} aria-label="Search Product" aria-describedby="button-search" />
          <button type="submit" className="btn btn-primary" id="button-search">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
