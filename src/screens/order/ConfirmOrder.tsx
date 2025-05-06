import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, CheckBox, Input, PaymentTypeDropdown, QuantityInput, Toast } from '../../components';
import { useState } from 'react';
import { IConfirmOrderRequest, IConfirmOrderResponse } from '../../interfaces/IOrder/IOrder';
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
import { useOrder } from '../../contexts/OrderContext';

const ConfirmOrder = () => {
    const navigate = useNavigate();

    // States
    const { orderItems, removeFromOrder, cleanOrder } = useOrder();
    const [paymentType, setPaymentType] = useState('');
    const [clientAddress, setClientAddress] = useState({
        useClientAddress: true,
        address: '',
    });
    const [submiting, setSubmiting] = useState(false);

    const categoriesBreadCrums = [
        {
            label: 'Orden de compra',
            active: true as const,
        },
    ];

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        if (!paymentType || (!clientAddress.useClientAddress && !clientAddress.address)) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (orderItems.some((x) => x.quantity <= 0)) {
            Toast.warning(Messages.Validation.graterOrEqualThanZero('cantidad del producto', true));
            return;
        }

        setSubmiting(true);

        const rq: IConfirmOrderRequest = {
            PaymentTypeId: paymentType,
            Items: orderItems.map((x) => ({
                ProductId: x.productId,
                Quantity: x.quantity,
            })),
            Address: clientAddress.address,
        };

        // TODO
        API.post<IConfirmOrderResponse, IConfirmOrderRequest>(`order/create`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                cleanOrder();
                navigate('/ordenes/misCompras');
            })
            .finally(() => {
                setSubmiting(false);
            });
    };
    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Orden de compra" />
            <Col xs={11} className="container my-order-confirm">
                <Card
                    title="Orden de compra"
                    body={
                        <>
                            {orderItems.length === 0 ? (
                                <span>No cuenta con productos en el carito</span>
                            ) : (
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
                                    {orderItems.map((orderItem, idx) => {
                                        return (
                                            <Col xs={12} className={`order-row ${idx % 2 === 0 ? 'bg-alternate' : ''}`} key={idx}>
                                                <Row>
                                                    <Col xs={12} md={3} className="d-flex mb-3 mb-md-0">
                                                        <div
                                                            className="me-2"
                                                            style={{ maxWidth: '75px', maxHeight: '75px', minWidth: '75px', minHeight: '75px' }}
                                                        >
                                                            <Image src={orderItem.image || noImage} className="w-100 h-100" />
                                                        </div>
                                                        <span className="fs-5">{orderItem.name}</span>
                                                    </Col>
                                                    <Col md={3} className="d-none d-md-flex justify-content-center my-auto mb-md-auto">
                                                        <span className="text-success fs-5">{formatCurrency(orderItem.price)}</span>
                                                    </Col>
                                                    <Col xs={5} md={3} className="d-flex">
                                                        <QuantityInput
                                                            quantityInputClassName="justify-content-start"
                                                            quantity={orderItem.quantity}
                                                            productId={orderItem.productId}
                                                        />
                                                    </Col>
                                                    <Col xs={5} md={2} className="justify-content-center d-flex my-auto">
                                                        <span className="text-success fs-5">
                                                            {formatCurrency(orderItem.price * orderItem.quantity)}
                                                        </span>
                                                    </Col>
                                                    <Col xs={1} md={1} className="p-0 d-flex my-auto justify-content-center">
                                                        <FontAwesomeIcon
                                                            onClick={() => removeFromOrder(orderItem.productId)}
                                                            icon={faClose}
                                                            color="red"
                                                            size="lg"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        );
                                    })}
                                    <Col className="text-start mt-4" xs={12} md={4}>
                                        <PaymentTypeDropdown
                                            label="Método de pago"
                                            required
                                            value={paymentType}
                                            isMulti={false}
                                            onChange={(v) => setPaymentType(v)}
                                        />
                                    </Col>
                                    <Col className="text-start mt-4" xs={12} md={4}>
                                        <CheckBox
                                            label={`Usar dirección actual ( ${LocalStorage.getUserAddress()})`}
                                            checked={clientAddress.useClientAddress}
                                            onChange={() => {
                                                setClientAddress((prevState) => ({ ...prevState, useClientAddress: !prevState.useClientAddress }));
                                            }}
                                        />
                                        {!clientAddress.useClientAddress && (
                                            <Input
                                                className="mt-2"
                                                placeholder="Dirección"
                                                value={clientAddress.address}
                                                onChange={(v) => setClientAddress((prevState) => ({ ...prevState, address: v }))}
                                            />
                                        )}
                                    </Col>
                                    <Col className="text-end" xs={12}>
                                        <span className="text-success fs-3">
                                            Total: {formatCurrency(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                                        </span>
                                    </Col>
                                </>
                            )}
                        </>
                    }
                />
                <Col className="d-flex flex-column flex-sm-row justify-content-between my-2" xs={12}>
                    <Button
                        size="lg"
                        className="mb-2 mb-sm-0"
                        onClick={() => navigate('/productos/list')}
                        left
                        icon={faArrowLeft}
                        iconStyle={{ marginLeft: '0px', marginRight: '8px' }}
                    >
                        Seguir eligiendo productos
                    </Button>
                    <Button disabled={orderItems.length === 0} variant="success" size="lg" onClick={handleSubmit}>
                        Finalizar compra
                    </Button>
                </Col>
            </Col>
        </>
    );
};

export default ConfirmOrder;
