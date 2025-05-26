import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, QuantityInput, Spinner } from '../../../components';
import API from '../../../app/API';
import { getBreadcrumbItemsProductDetails } from '../Products.helpers';
import noImage from '../../../assets/no_image.jpg';
import { formatCurrency } from '../../../app/Helpers';
import { IProductDetailsForm } from '../../../interfaces/IProduct/IProduct';
import { useOrder } from '../../../contexts/OrderContext';
import { ReviewsCard } from '../Reviews/ReviewsCard';

const InitialProductDetails: IProductDetailsForm = {
    name: '',
    description: '',
    image: '',
    price: '',
    stock: '',
    categoryName: '',
    sellerDetails: {
        userName: '',
        storeName: '',
        storeDescription: '',
    },
};

const ProductDetails = () => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialProductDetails);
    const [loading, setLoading] = useState(id ? true : false);
    const { orderItems, addToOrder, removeFromOrder } = useOrder();

    // Effects
    useEffect(() => {
        if (id) {
            API.get<IProductDetailsForm>('product/getDetails/' + id, {}).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    return (
        <>
            <BreadCrumb items={getBreadcrumbItemsProductDetails(form.name)} title={form.name} />
            <div>
                <Col xs={11} className="container product-details">
                    <Card
                        body={
                            loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <Row className="g-4 align-items-start">
                                    {/* Imagen */}
                                    <Col xs={12} md={4} className="text-center">
                                        <Image
                                            src={form.image || noImage}
                                            alt="Producto"
                                            fluid
                                            rounded
                                            style={{ maxHeight: '350px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                                        />
                                    </Col>

                                    {/* Info product */}
                                    <Col className="h-100" xs={12} md={8}>
                                        <div className="d-flex flex-column h-100 justify-content-between">
                                            <div>
                                                <h2 className="mb-2">{form.name}</h2>
                                                <h5 className="text-muted mb-3">{form.categoryName}</h5>
                                                <p className="mb-4" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                                                    {form.description}
                                                </p>

                                                <div className="mb-3">
                                                    {Number(form.stock) > 0 ? (
                                                        <span className="text-success fw-semibold">
                                                            En stock ({form.stock} {form.stock === '1' ? 'unidad' : 'unidades'})
                                                        </span>
                                                    ) : (
                                                        <span className="text-danger fw-semibold">Sin stock</span>
                                                    )}
                                                </div>

                                                <div className="mb-4">
                                                    <span className="fs-4 fw-bold text-primary">{formatCurrency(form.price)}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div>
                                                {orderItems.find((x) => x.productId === id) && (
                                                    <div className="mb-3">
                                                        <QuantityInput
                                                            alignDirection="start"
                                                            productId={id!}
                                                            quantity={orderItems.find((x) => x.productId === id)?.quantity || 0}
                                                        />
                                                    </div>
                                                )}
                                                <Row className="g-2">
                                                    <Col xs={12} md={6}>
                                                        <Button
                                                            className="w-100 btn-sm"
                                                            variant={orderItems.some((item) => item.productId === id) ? 'danger' : 'success'}
                                                            disabled={Number(form.stock) === 0 && !orderItems.some((item) => item.productId === id)}
                                                            onClick={() =>
                                                                orderItems.some((item) => item.productId === id)
                                                                    ? removeFromOrder(id!)
                                                                    : addToOrder({
                                                                          name: form.name,
                                                                          price: Number(form.price),
                                                                          productId: id!,
                                                                          quantity: 1,
                                                                          image: form.image,
                                                                      })
                                                            }
                                                        >
                                                            {orderItems.some((item) => item.productId === id)
                                                                ? 'Quitar del carrito'
                                                                : 'Agregar al carrito'}
                                                        </Button>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Button className="w-100 btn-sm" onClick={() => navigate('/productos/list')}>
                                                            Volver
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            )
                        }
                    />
                    <Card
                        className="w-50"
                        title="Detalles del vendedor"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row>
                                        <Col className="mb-1" xs={12}>
                                            <strong>Nombre: </strong>
                                            <p className="d-inline">{form.sellerDetails.userName}</p>
                                        </Col>
                                        <Col className="mb-1" xs={12}>
                                            <strong>Tienda: </strong>
                                            <p className="d-inline">{form.sellerDetails.storeName}</p>
                                        </Col>
                                        <Col xs={12}>
                                            <p>{form.sellerDetails.storeDescription}</p>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                    />
                    <ReviewsCard loading={loading} id={id!} />
                </Col>
            </div>
        </>
    );
};

export default ProductDetails;
