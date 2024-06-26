import React, { useContext, useState } from "react";
import { client } from "../../../lib/client";
import { urlFor } from "../../../lib/client";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Product } from "../../../components";
import { useStateContext } from "../../../context/StateContext";

const ProductDetails = ({product, products}) => {
  let {image, name, details, price} = product;
  const [index, setIndex] = useState(0)
  const {decQty, incQty, qty, onAdd, setShowCart} = useStateContext();



  const handleBuyNow = () => { 
    onAdd(product, qty);
    setShowCart(true)
  }

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className ="image-container">
              <img src={urlFor(image && image[index])} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img key={i} className={i === index ? 'small-image selected-image' : 'small-image'} src={urlFor(item)} onMouseEnter={() => setIndex(i)} />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>
            {name}
          </h1>
          <div className="reviews">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
          </div>
          <p>
            (20)
          </p>
        <h4>Details:</h4>
        <p>{details}</p>
        <p className="price">${price}</p>
        <div className="quantity">
          <h3>Quantity:</h3>
          <p className="quantity-desc">
            <span className="minus" onClick={decQty}>
              <AiOutlineMinus  />
            </span>
            <span className="num">
                {qty}
            </span>
            <span className="plus" onClick={incQty}>
              <AiOutlinePlus  />
            </span>
          </p>
        </div>
        <div className="buttons">
            <button className="add-to-cart" type="button" onClick={() => onAdd(product, qty)}>
                Add to Cart
            </button>
            <button className="buy-now" type="button" onClick={handleBuyNow}>
                Buy now
            </button>
        </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
          <h2>
            You may also like
          </h2>
          <div className="marquee">
            <div className="maylike-products-container track">
              {products?.map(product => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};


// Functions for fetch props from sanity

export const getStaticPaths = async () => { 
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query)
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  }
}


export const getStaticProps = async ({params: {slug}}) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = `*[_type == 'product']`

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery)

  return {
    props: { product, products }
  }
}

export default ProductDetails;
