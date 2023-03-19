import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api';
import LodingBox from '../components/LodingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { getError } from '../utils';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload.products, page: action.payload.page, pages: action.payload.pages, countProducts: action.payload.countProducts, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
// ==================
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];
// ==============
const ratings = [
  {
    name: '5stars & up',
    rating: 5,
  },
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },
  {
    name: '1stars & up',
    rating: 1,
  },
];
const SearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=tsirt exam
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // ==============================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${api}/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [error, category, order, price, page, query, rating]);

  // ====================================================

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCtegories = async () => {
      try {
        const { data } = await axios.get(`${api}/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCtegories();
  }, [dispatch]);
  console.log(categories);

  const getFillterUrl = (filter) => {
    const fillterPage = filter.page || page;
    const fillterCategory = filter.category || category;
    const fillterQuery = filter.query || query;
    const fillterRating = filter.rating || rating;
    const fillterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?page=${fillterPage}&query=${fillterQuery}&category=${fillterCategory}&price=${fillterPrice}&rating=${fillterRating}&order=${sortOrder}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="row">
        <div className="col-md-3">
          <h3>Department</h3>
          {/* ===== Category ====== */}
          <div>
            <ul>
              <li>
                <Link className={'all' === category ? 'text-bold' : ''} to={getFillterUrl({ category: 'all' })}>
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link className={c === category ? 'text-bold' : ''} to={getFillterUrl({ category: c })}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* ===== Price ====== */}
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link className={'all' === price ? 'text-bold' : ''} to={getFillterUrl({ price: 'all' })}>
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link className={p.value === price ? 'text-bold' : ''} to={getFillterUrl({ price: p.value })}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* ====== Reviews ===== */}
          <div>
            <h3>Avg. Custemer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link className={`${r.rating}` === `${rating}` ? 'text-bold' : ''} to={getFillterUrl({ rating: r.rating })}>
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link className={rating === 'all' ? 'text-bold' : ''} to={getFillterUrl({ rating: 'all' })}>
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>

          {/* =========== */}
        </div>
        {/* === col 2 === */}
        <div className="col-md-9">
          {loading ? (
            <LodingBox></LodingBox>
          ) : error ? (
            <MessageBox className="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="row justify-content-between mb-3">
                <div className="col-md-6">
                  <div>
                    {countProducts === 0 ? 'No' : countProducts}Result
                    {query !== 'all' && ':' + query}
                    {category !== 'all' && ':' + category}
                    {price !== 'all' && ': Price' + price}
                    {rating !== 'all' && ': Rating' + rating + ' & up'}
                    {query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                      <button className="btn btn-light" onClick={() => navigate('/search')}>
                        <i className="fas fa-times-circle"></i>
                      </button>
                    ) : null}
                  </div>
                </div>
                {/* ===== */}
                <div className="col text-end">
                  Sort by :{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFillterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">News Arivals</option>
                    <option value="lowest">Price : Low to hight</option>
                    <option value="highest">Price : Hight to Low</option>
                    <option value="topreted">Avg, Customer Reviews</option>
                  </select>
                </div>
                {/* =========== */}
              </div>
              {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
              <div className="row">
                {products.map((product) => (
                  <div className="col-sm-6 col-lg-4 mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </div>
                ))}
              </div>
              {/* ====== pagination ======== */}
              {[...Array(pages).keys()].map((x) => (
                <div className="container">
                  <Link key={x + 1} className="mx-1" to={getFillterUrl({ page: x + 1 })}>
                    <button className={`btn btn-light ${Number(page) === x + 1 ? 'text-bold' : ''}`}></button>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>

        {/* === col 3 === */}
      </div>
    </div>
  );
};

export default SearchScreen;
