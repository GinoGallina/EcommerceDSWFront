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
import './productDetails.scss';

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
                        title={form.name}
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row>
                                        <Col xs={12} md={5}>
                                            <div className="mx-auto my-auto" style={{ maxHeight: '350px', maxWidth: '350px' }}>
                                                <Image className="w-100 h-100" src={form.image || noImage}></Image>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={7}>
                                            <Row className="h-100 flex-column" style={{ fontSize: '25px' }}>
                                                <Col className="mb-3" xs={12}>
                                                    <h4>{form.categoryName}</h4>
                                                </Col>
                                                <Col className="mb-3 description" xs={12}>
                                                    {form.description}
                                                </Col>
                                                <Col className="mb-3" xs={12}>
                                                    {Number(form.stock) > 0 ? (
                                                        <>
                                                            <h5 className="text-success">
                                                                In stock ({form.stock} {form.stock == '1' ? 'unit' : 'units'})
                                                            </h5>
                                                        </>
                                                    ) : (
                                                        <h5 className="text-danger">Sin Stock</h5>
                                                    )}
                                                </Col>
                                                <Col className="mb-3" xs={12}>
                                                    <span style={{ fontWeight: 'bold' }}>{formatCurrency(form.price)}</span>
                                                </Col>
                                                <Col className="mt-auto" xs={12}>
                                                    <Row>
                                                        {orderItems.find((x) => x.productId === id) && (
                                                            <Col>
                                                                <QuantityInput
                                                                    alignDirection="start"
                                                                    productId={id!}
                                                                    quantity={orderItems.find((x) => x.productId === id)?.quantity || 0}
                                                                />
                                                            </Col>
                                                        )}
                                                        <Col xs={12} md={6} lg={4}>
                                                            {orderItems.some((item) => item.productId === id) ? (
                                                                <Button
                                                                    className="bg-danger btn-sm border-0 w-100"
                                                                    onClick={() => removeFromOrder(id!)}
                                                                >
                                                                    Quitar del carrito
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="bg-success btn-sm border-0 w-100"
                                                                    disabled={Number(form.stock) === 0}
                                                                    onClick={() =>
                                                                        addToOrder({
                                                                            name: form.name,
                                                                            price: Number(form.price),
                                                                            productId: id!,
                                                                            quantity: 1,
                                                                            image: form.image,
                                                                        })
                                                                    }
                                                                >
                                                                    Agregar al carrito
                                                                </Button>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            <div className="d-flex justify-content-start">
                                <Button variant="secondary" className="me-2" onClick={() => navigate('/productos/list')}>
                                    Volver
                                </Button>
                            </div>
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
