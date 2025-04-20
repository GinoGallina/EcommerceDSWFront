import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, PaymentTypeDropdown, QuantityInput, Toast } from '../../components';
import { useState } from 'react';
import { IOrderItem, IConfirmOrderRequest } from '../../interfaces/IOrder/IOrder';
import { LocalStorage } from '../../app/LocalStorage';
import { confirmOrderCols } from './Order.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClose } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../app/Helpers';
import noImage from '../../assets/no_image.jpg';
import './confirmOrder.scss';
import { Messages } from '../../app/constants/Messages';
import API from '../../app/API';
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
    const navigate = useNavigate();

    // States
    const [order, setOrder] = useState<IOrderItem[]>(LocalStorage.getOrderItems());
    const [paymentType, setPaymentType] = useState('');
    const [submiting, setSubmiting] = useState(false);

    const categoriesBreadCrums = [
        {
            label: 'Mi compra',
            active: true as const,
        },
    ];

    const handleRemoveItemFromOrder = (id: string) => {
        const newOrder = order.filter((x) => x.productId !== id);
        setOrder(newOrder);
        LocalStorage.setOrderItems(newOrder);
    };
    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        if (order.some((x) => x.quantity < 0)) {
            Toast.warning(Messages.Validation.graterThanZero('cantidad', true));
            return;
        }

        setSubmiting(true);

        const rq: IConfirmOrderRequest = {
            PaymentTypeId: paymentType,
            Items: order.map((x) => ({
                ProductId: x.productId,
                Quantity: x.quantity,
            })),
        };

        API.post<unknown, IConfirmOrderRequest>(`order/create`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/misCompras');
            })
            .finally(() => {
                setSubmiting(false);
            });
    };
    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Mi compra" />
            <Col xs={11} className="container my-order-confirm">
                <Card
                    title="Mi compra"
                    body={
                        <>
                            <Col xs={12} className="d-none d-md-block" style={{ fontWeight: '500' }}>
                                <Row className="fs-4">
                                    {confirmOrderCols.map((x, idx) => (
                                        <Col xs={idx === 3 ? 2 : 3} className={x.className} key={idx}>
                                            <span>{x.text}</span>
                                        </Col>
                                    ))}
                                    <Col xs={1} />
                                </Row>
                            </Col>
                            <hr className="d-none d-md-block" />
                            {order.map((orderItem, idx) => {
                                return (
                                    <>
                                        <Col xs={12} className={`order-row ${idx % 2 === 0 ? 'bg-alternate' : ''}`} key={idx}>
                                            <Row>
                                                <Col xs={12} md={3} className="d-flex mb-3 mb-md-0">
                                                    <div className="me-2" style={{ maxWidth: '75px', maxHeight: '75px' }}>
                                                        <Image src={orderItem.image || noImage} className="w-100 h-100" />
                                                    </div>
                                                    <span className="fs-5">{orderItem.name}</span>
                                                </Col>
                                                <Col md={3} className="d-none d-md-flex justify-content-center my-auto mb-md-auto">
                                                    <span className="text-success fs-5">{formatCurrency(orderItem.price)}</span>
                                                </Col>
                                                <QuantityInput
                                                    xs={5}
                                                    md={3}
                                                    quantity={orderItem.quantity}
                                                    productId={orderItem.productId}
                                                    setOrder={setOrder}
                                                />
                                                <Col xs={5} md={2} className="justify-content-center d-flex my-auto">
                                                    <span className="text-success fs-5">{formatCurrency(orderItem.price * orderItem.quantity)}</span>
                                                </Col>
                                                <Col xs={1} md={1} className="p-0 d-flex my-auto justify-content-center">
                                                    <FontAwesomeIcon
                                                        onClick={() => handleRemoveItemFromOrder(orderItem.productId)}
                                                        icon={faClose}
                                                        color="red"
                                                        size="lg"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </>
                                );
                            })}
                            <Col className="text-start mt-4" xs={12} md={4}>
                                <PaymentTypeDropdown required value={paymentType} isMulti={false} onChange={(v) => setPaymentType(v)} />
                            </Col>
                            <Col className="text-end" xs={12}>
                                <span className="text-success fs-3">
                                    Total: {formatCurrency(order.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                                </span>
                            </Col>
                        </>
                    }
                />
                <Col className="d-flex justify-content-between my-2" xs={12}>
                    <Button size="lg" onClick={() => navigate('/productos/list')} icon={faArrowLeft}>
                        Seguir eligiendo productos
                    </Button>
                    <Button variant="success" size="lg" onClick={handleSubmit}>
                        Finalizar compra
                    </Button>
                </Col>
            </Col>
        </>
    );
};

export default ConfirmOrder;
