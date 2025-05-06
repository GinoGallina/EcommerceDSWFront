import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Loader, Spinner, Toast } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import API from '../../app/API';
import App from '../../app/App';
import { IOrderCancelOrderResponse, IOrderCancelProductRequest, IOrderDetailsForm } from '../../interfaces/IOrder/IOrder';
import { getStatus } from './Order.helpers';
import { formatCurrency } from '../../app/Helpers';
import noImage from '../../assets/no_image.jpg';
import Tooltip from '../../components/Tooltip/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { OrderItemStatuses, OrderStatuses } from '../../app/constants/Statuses';
import './orderDetail.scss';
import { LocalStorage } from '../../app/LocalStorage';

const OrderDetails = () => {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();

    // State
    const [form, setForm] = useState(InitialFormStates.OrderDetails);
    const [loading, setLoading] = useState(id ? true : false);
    const [submiting, setSubmiting] = useState(false);

    const ordersBreadCrums = [
        {
            label: App.isUser() ? 'Mis compras' : 'Compras',
            url: '/ordenes/misCompras',
            active: false,
        },
        {
            label: `Orden N° ${id}`,
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        if (id) {
            API.get<IOrderDetailsForm>('order/getOne/' + id, {}).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    useEffect(() => {
        if (!App.isAdmin() && form.userId && form.userId !== LocalStorage.getUserId()) navigate('/');
    }, [form.userId, navigate]);

    const handleCancelProduct = (productId: string) => {
        if (submiting) return;

        API.post<IOrderCancelOrderResponse, IOrderCancelProductRequest>(`order/cancelProduct/${id}`, { ProductId: productId })
            .then((r) => {
                if (r.message) Toast.success(r.message);
                setForm((prevForm) => {
                    const newItems = prevForm.items.map((x) => {
                        if (x.productId === productId)
                            return {
                                ...x,
                                status: OrderItemStatuses.Canceled,
                            };
                        return x;
                    });
                    return {
                        ...prevForm,
                        items: newItems,
                        status: newItems.every((x) => x.status === OrderItemStatuses.Canceled) ? OrderStatuses.Canceled : prevForm.status,
                    };
                });
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleCancelOrder = () => {
        if (submiting) return;

        API.post<IOrderCancelOrderResponse, unknown>(`order/cancelOrder/${id}`, {})
            .then((r) => {
                if (r.message) Toast.success(r.message);
                setForm((prevForm) => ({
                    ...prevForm,
                    status: OrderStatuses.Canceled,
                    items: prevForm.items.map((x) => {
                        return {
                            ...x,
                            status: OrderItemStatuses.Canceled,
                        };
                    }),
                }));
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const orderStatus = getStatus(form.status);

    return (
        <>
            <BreadCrumb items={ordersBreadCrums} title={`Orden N° ${id}`} />
            <div>
                <Col xs={11} className="container order-detail-container">
                    <Card
                        title="Resumen de la orden"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <Row className="align-items-center">
                                    <Col md={6} className="mb-2">
                                        <strong>📦 Estado:</strong>
                                        <span className="ms-2 fw-bold" style={{ color: orderStatus.color }}>
                                            {orderStatus.value}
                                        </span>
                                    </Col>

                                    <Col md={6} className="mb-2">
                                        <strong>🏠 Dirección:</strong>
                                        <span className="ms-2">{form.shippingAddress}</span>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <strong>💳 Método de Pago:</strong>
                                        <span className="ms-2">{form.paymentType}</span>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <strong>🧾 Total:</strong>
                                        <span className="ms-2 text-success fw-bold">{formatCurrency(form.total)}</span>
                                    </Col>
                                    <hr />
                                    {form.items.map((orderItem, index) => (
                                        <Col
                                            key={index}
                                            xs={12}
                                            md={{
                                                span: 7,
                                                offset: index % 2 ? 5 : 0,
                                            }}
                                            className="mb-4 d-flex justify-content-center"
                                            style={{ justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end' }}
                                        >
                                            <div className="p-4 border rounded-4 shadow-sm bg-white w-100">
                                                <Row>
                                                    <Col xs={12} md={8}>
                                                        <h5 className="mb-3">Detalle del Producto</h5>
                                                        <ul className="list-unstyled mb-0">
                                                            <li className="mb-2">
                                                                <strong>🛍 Producto:</strong>{' '}
                                                                <span className="ms-2">
                                                                    {orderItem.product} (x{orderItem.quantity})
                                                                </span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <strong>💲 Precio:</strong>
                                                                <span className="ms-2 text-success fw-bold">{formatCurrency(orderItem.price)}</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <strong>🧾 Total:</strong>
                                                                <span className="ms-2 text-success fw-bold">
                                                                    {formatCurrency(orderItem.price * orderItem.quantity)}
                                                                </span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <strong>📦 Estado:</strong>
                                                                <span className="ms-2 fw-bold" style={{ color: getStatus(orderItem.status).color }}>
                                                                    {getStatus(orderItem.status).value}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </Col>
                                                    <Col xs={12} md={4} className="d-flex align-items-center justify-content-center mt-3 mt-md-0">
                                                        <Image
                                                            src={orderItem.imagen || noImage}
                                                            alt="Imagen del producto"
                                                            className="rounded-3 border"
                                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                            fluid
                                                        />
                                                    </Col>
                                                </Row>
                                                {orderItem.status === OrderStatuses.Pending && (
                                                    <Row>
                                                        <Col className="mt-1 text-center">
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                disabled={orderItem.status !== OrderStatuses.Pending}
                                                                onClick={() => handleCancelProduct(orderItem.productId)}
                                                            >
                                                                {submiting ? <Loader /> : ' Cancelar producto'}
                                                            </Button>
                                                            <div className="d-inline-flex h-100 ">
                                                                <Tooltip
                                                                    placement="top"
                                                                    text="Solo podrá cancelar el producto si su estado es PENDIENTE."
                                                                >
                                                                    <FontAwesomeIcon className="my-auto ms-2" icon={faInfoCircle} color="black" />
                                                                </Tooltip>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                )}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )
                        }
                        footer={
                            <Row>
                                <Col className="text-end">
                                    <Button
                                        variant="danger"
                                        disabled={
                                            !form.items.every(
                                                (x) => x.status === OrderItemStatuses.Pending || x.status === OrderItemStatuses.Canceled
                                            ) || form.items.every((x) => x.status === OrderItemStatuses.Canceled)
                                        }
                                        onClick={handleCancelOrder}
                                    >
                                        {submiting ? <Loader /> : ' Cancelar orden'}
                                    </Button>
                                    <div className="d-inline-flex h-100 ">
                                        <Tooltip
                                            placement="top"
                                            text="Solo podrá cancelar la orden si el estado de todos los productos es PENDIENTE."
                                        >
                                            <FontAwesomeIcon className="my-auto ms-2" icon={faInfoCircle} color="black" />
                                        </Tooltip>
                                    </div>
                                </Col>
                            </Row>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default OrderDetails;
