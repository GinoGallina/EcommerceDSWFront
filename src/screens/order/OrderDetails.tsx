import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Card, Spinner } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import API from '../../app/API';
import App from '../../app/App';
import { IOrderDetailsForm } from '../../interfaces/IOrder/IOrder';
import { getStatus } from './Order.helpers';
import { formatCurrency } from '../../app/Helpers';
import noImage from '../../assets/no_image.jpg';
import './orderDetail.scss';

const OrderDetails = () => {
    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.OrderDetails);
    const [loading, setLoading] = useState(id ? true : false);

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

    const orderStatus = getStatus(form.status);

    return (
        <>
            <BreadCrumb items={ordersBreadCrums} title={`Orden N° ${id}`} />
            <div>
                <Col xs={11} className="container order-detail-container">
                    <Card
                        title={`Orden N° ${id}`}
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <Row className="align-items-center">
                                    <Col xs={12} className="mb-3">
                                        <strong>Estado: </strong>
                                        <span style={{ color: orderStatus.color, fontWeight: 'bold' }}>{orderStatus.value}</span>
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <strong>Dirección:</strong> {form.shippingAddress}
                                    </Col>
                                    <Col xs={12} className="mb-3">
                                        <strong>Método de Pago:</strong> {form.paymentType}
                                    </Col>
                                    <Col xs={12} className="mb-4">
                                        <strong>Total: </strong>
                                        <span className="text-success" style={{ fontWeight: 'bold' }}>
                                            {formatCurrency(form.total)}
                                        </span>
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
                                            <div className="p-3 border rounded-4 shadow-sm bg-white w-100">
                                                <Row>
                                                    <Col className="d-flex align-items-between mb-2 mb-sm-0" xs={12} sm={6}>
                                                        <Row className="order-item-details">
                                                            <Col xs={12} className="mb-2">
                                                                <strong>Producto:</strong>
                                                                &nbsp;
                                                                {orderItem.product}
                                                            </Col>
                                                            <Col xs={12} className="mb-2">
                                                                <strong>Cantidad:</strong>
                                                                &nbsp;
                                                                {orderItem.quantity}
                                                            </Col>
                                                            <Col xs={12} className="mb-2">
                                                                <strong>Precio:</strong>
                                                                &nbsp;
                                                                {formatCurrency(orderItem.price)}
                                                            </Col>
                                                            <Col xs={12}>
                                                                <strong>Estado:</strong>
                                                                &nbsp;
                                                                <span style={{ color: getStatus(orderItem.status).color, fontWeight: 'bold' }}>
                                                                    {getStatus(orderItem.status).value}
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col className="d-flex" xs={12} sm={6}>
                                                        <div
                                                            className="mx-auto my-auto w-100 h-100"
                                                            style={{ maxHeight: '250px', maxWidth: '250px' }}
                                                        >
                                                            <Image className="w-100 h-100" src={orderItem.imagen || noImage}></Image>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default OrderDetails;
