import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, QuantityInput } from '../../components';
import { useState } from 'react';
import { ICartItem } from '../../interfaces/ICart/ICart';
import { LocalStorage } from '../../app/LocalStorage';
import { confirmCartCols } from './Cart.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../app/Helpers';
import noImage from '../../assets/no_image.jpg';
import './confirmCart.scss';

const ConfirmCart = () => {
    // States
    const [cart, setCart] = useState<ICartItem[]>(LocalStorage.getCartItems());

    const categoriesBreadCrums = [
        {
            label: 'Mi compra',
            active: true as const,
        },
    ];

    const handleRemoveItemFromCart = (id: string) => {
        const newCart = cart.filter((x) => x.productId !== id);
        setCart(newCart);
        LocalStorage.setCartItems(newCart);
    };
    // Handlers
    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Mi compra" />
            <Col xs={11} className="container my-cart-confirm">
                <Card
                    title="Mi compra"
                    body={
                        <>
                            <Col xs={12} className="d-none d-md-block">
                                <Row>
                                    {confirmCartCols.map((x, idx) => (
                                        <Col xs={idx === 3 ? 2 : 3} className={x.className} key={idx}>
                                            <span className="bold">{x.text}</span>
                                        </Col>
                                    ))}
                                    <Col xs={1} />
                                </Row>
                            </Col>
                            <hr className="d-none d-md-block" />
                            {cart.map((cartItem, idx) => {
                                return (
                                    <>
                                        <Col xs={12} className="p-2" key={idx}>
                                            <Row>
                                                <Col xs={6} md={3} className="d-flex mb-3 mb-md-0">
                                                    <div className="me-2" style={{ maxWidth: '100px', maxHeight: '100px' }}>
                                                        <Image src={cartItem.image || noImage} className="w-100 h-100" />
                                                    </div>
                                                    <span className="fs-5">{cartItem.name}</span>
                                                </Col>
                                                <Col xs={5} md={3} className="justify-content-center d-flex my-auto mb-md-auto">
                                                    <span className="text-success fs-5">{formatCurrency(cartItem.price)}</span>
                                                </Col>
                                                <QuantityInput
                                                    xs={6}
                                                    md={3}
                                                    quantity={cartItem.quantity}
                                                    productId={cartItem.productId}
                                                    setCart={setCart}
                                                />
                                                <Col xs={5} md={2} className="justify-content-center d-flex my-auto">
                                                    <span className="text-success fs-5">{formatCurrency(cartItem.price * cartItem.quantity)}</span>
                                                </Col>
                                                <Col xs={1} md={1} className="p-0 d-flex my-auto justify-content-center">
                                                    <FontAwesomeIcon
                                                        onClick={() => handleRemoveItemFromCart(cartItem.productId)}
                                                        icon={faClose}
                                                        color="red"
                                                        size="sm"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <hr />
                                    </>
                                );
                            })}
                            <Col className="text-end " xs={12}>
                                <span className="text-success fs-3">
                                    Total: {formatCurrency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                                </span>
                            </Col>
                        </>
                    }
                />
                <Col className="text-end" xs={12}>
                    <Button variant="success" onClick={() => {}}>
                        Finalizar compra
                    </Button>
                </Col>
            </Col>
        </>
    );
};

export default ConfirmCart;
