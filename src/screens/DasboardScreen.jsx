import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { api } from '../api';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const DasboardScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  // ===============================
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    };

    try {
      const res = await axios.post(`${api}/api/products`, newProduct, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      console.log(res.data); // success message
      // reset the form after submit
      setName('');
      setSlug('');
      setImage('');
      setBrand('');
      setCategory('');
      setDescription('');
      setPrice(0);
      setCountInStock(0);
      setRating(0);
      setNumReviews(0);
      toast.success('succsessfully created product');
    } catch (error) {
      console.log(error.message);
      toast.error(getError(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Slug:</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div>
        <label>Image:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <div>
        <label>Brand:</label>
        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>
      <div>
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <label>Count in Stock:</label>
        <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
      </div>
      <div>
        <label>Rating:</label>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <div>
        <label>Number of Reviews:</label>
        <input type="number" value={numReviews} onChange={(e) => setNumReviews(e.target.value)} />
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default DasboardScreen;
// =================================
