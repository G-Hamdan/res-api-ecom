import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useDelete } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 280px;
  height: 460px;
  margin: 1rem;
  position: relative;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => (props.$flipped ? 'rotateY(180deg)' : 'none')};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 14px;
  overflow: hidden;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 6px 16px rgba(126, 34, 206, 0.2);
  color: #f5f5f5;
  font-family: 'Rajdhani', sans-serif;
`;

const CardFront = styled(CardFace)`
  z-index: 2;
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  padding: 1rem;
  background-color: #111;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #222;
`;

const CardBody = styled.div`
  padding: 1rem;
  text-align: left;
  flex-grow: 1;

  h5 {
    font-size: 1.3rem;
    font-family: 'Anton', sans-serif;
    margin: 0 0 0.5rem;
    color: #a855f7;
  }

  p {
    font-size: 1rem;
    color: #ccc;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

const Button = styled.button`
  background-color: #7e22ce;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &.delete:hover {
    background-color: #dc2626;
  }
  &.edit:hover {
    background-color: #d97706;
  }
  &.add-to-cart {
    background-color: #0fdb8b;
    color: #000;
  }
  &.add-to-cart:hover {
    background-color: #22c55e;
  }
  &:hover {
    transform: scale(1.03);
  }
`;

const CardComponent = ({ _id, productName, price, imageUrl, productDescription }) => {
  const [flipped, setFlipped] = useState(false);
  const [showAddNotification, setAddNotification] = useState(false);
  const [showDeleteNotification, setDeleteNotification] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const { addToCart } = useCart();
  const { deleteProduct } = useDelete();

  const handleFlip = () => setFlipped(!flipped);

  const handleAddToCart = () => {
    addToCart({ _id, productName, price, imageUrl, productDescription });
    setAddNotification(true);
    setTimeout(() => setAddNotification(false), 2000);
  };

  const handleDeleteClick = () => {
    deleteProduct(_id);
    setDeleteNotification(true);
    setTimeout(() => setDeleteNotification(false), 2000);
  };

  return (
    <CardContainer>
      {showAddNotification && (
        <div className="notification" style={{ backgroundColor: '#22c55e' }}>
          Added to Cart!
        </div>
      )}
      {showDeleteNotification && (
        <div className="notification" style={{ backgroundColor: '#dc2626' }}>
          Deleted! Refresh to update.
        </div>
      )}

      <CardInner $flipped={flipped}>
        <CardFront>
          <CardImage
            src={imgSrc}
            alt={productName}
            onError={() => setImgSrc("/fallback-image.jpg")}
          />
          <CardBody>
            <h5>{productName}</h5>
            <p>${price.toFixed(2)}</p>
          </CardBody>
          <ButtonGroup>
            <Button onClick={handleFlip}>View</Button>
          </ButtonGroup>
        </CardFront>

        <CardBack>
          <h5>{productName}</h5>
          <p>{productDescription}</p>
          <p><strong>Price:</strong> ${price}</p>
          <ButtonGroup>
            <Link to={`/editproduct/${_id}`}>
              <Button className="edit">Edit</Button>
            </Link>
            <Button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</Button>
            <Button className="delete" onClick={handleDeleteClick}>Delete</Button>
            <Button onClick={handleFlip}>Back</Button>
          </ButtonGroup>
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default CardComponent;
