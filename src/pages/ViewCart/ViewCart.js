import React, { useContext, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { CartContext } from '../../CartContext';
import './ViewCart.css';

const ViewCart = () => {
  const { cart, updateCartItemQuantity, removeFromCart, onAddToCart } = useContext(CartContext);
  const [lastRemovedItem, setLastRemovedItem] = useState(null);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  const handleQuantityChange = (event, item) => {
    const value = Math.max(1, Number(event.target.value));
    if (value > item.stock) {
      alert(`You can't go above the quantity that is present: ${item.stock}`);
    } else {
      updateCartItemQuantity(item.id, item.size, item.color, value);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item);
    setLastRemovedItem(item);
  };

  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      onAddToCart(lastRemovedItem);
      setLastRemovedItem(null);
    }
  };

  const calculateSubtotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleUpdateCart = () => {
    setShowUpdateMessage(true);
    setTimeout(() => {
      setShowUpdateMessage(false);
    }, 3000);
  };

  return (
    <Container className="view-cart">
      {lastRemovedItem && (
        <div className="success-message viewcart-msg d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="fas fa-undo mr-3" style={{ color: '#031A6B' }}></i>
            <span className="">
              “{lastRemovedItem.title}” removed.{' '}
              <a onClick={handleUndoRemove} className="undo-link">Undo?</a>
            </span>
          </div>
        </div>
      )}
      {showUpdateMessage && (
        <div className="success-message viewcart-msg d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="fa-duotone fa-cart-shopping mr-3" style={{ color: '#031A6B' }}></i>
            <span className="ml-2">Your cart is updated.</span>
          </div>
        </div>
      )}
      {cart.length > 0 ? (
        <>
          <Table bordered className="cart-table mt-5 d-none d-lg-table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Button onClick={() => handleRemoveItem(item)} className="remove-button">×</Button>
                  </td>
                  <td>
                    <div className="product-details-table">
                      <img src={item.image} alt={item.title} className="cart-item-image mr-5" />
                      <span>{`${item.title} - ${item.color}, ${item.size}`}</span>
                    </div>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item)}
                      min="1"
                      className="quantity-input"
                    />
                  </td>
                  <td>${calculateSubtotal(item)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Mobile View */}
          <div className="d-lg-none">
            {cart.map((item, index) => (
              <div key={index} className="cart-item-mobile mb-3 p-3 border rounded">
                <Button
                  onClick={() => handleRemoveItem(item)}
                  className="remove-button float-right"
                  variant="link"
                >
                  ×
                </Button>
                <div className="d-flex justify-content-center mb-3">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                </div>
                <div className="mb-2"><strong>Product:</strong> {item.title} - {item.color}, {item.size}</div>
                <div className="mb-2"><strong>Price:</strong> ${item.price}</div>
                <div className="mb-2">
                  <strong>Quantity:</strong>
                  <Form.Control
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(e, item)}
                    min="1"
                    className="quantity-input mt-2"
                  />
                </div>
                <div><strong>Subtotal:</strong> ${calculateSubtotal(item)}</div>
              </div>
            ))}
          </div>

          <div className="container">
            <div className="row">
              <div className="d-none d-lg-block col-lg-2">
                <div className="d-flex align-items-center">
                  <input type="text" placeholder="Coupon code" className="form-control coupon-input" />
                </div>
              </div>
              <div className="d-none d-lg-block col-lg-2">
                <button className="btn btn-primary btn-block apply-coupon-btn">APPLY COUPON</button>
              </div>
              <div className="d-none d-lg-block col-lg-6"></div>
              <div className="d-none d-lg-block col-lg-2">
                <button className="btn btn-secondary btn-block update-cart-btn" onClick={handleUpdateCart}>UPDATE CART</button>
              </div>

              <div className="d-lg-none col-6">
                <div className="d-flex align-items-center">
                  <input type="text" placeholder="Coupon code" className="form-control coupon-input" />
                </div>
              </div>
              <div className="d-lg-none col-6">
                <button className="btn btn-primary btn-block apply-coupon-btn">APPLY COUPON</button>
              </div>

              <div className="d-lg-none col-12">
                <button className="btn btn-secondary btn-block update-cart-btn" onClick={handleUpdateCart}>UPDATE CART</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="success-message viewcart-msg d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="fa-duotone fa-cart-shopping mr-3" style={{ color: '#031A6B' }}></i>
            <span className="ml-2">Your cart is empty.</span>
          </div>
        </div>
      )}
      <div className="total">
        <h4>Total: ${calculateTotal()}</h4>
      </div>
    </Container>
  );
};

export default ViewCart;
