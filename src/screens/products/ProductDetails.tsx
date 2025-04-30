import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Image, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Loader, Pagination, QuantityInput, Spinner, Toast } from '../../components';
import API from '../../app/API';
import { getBreadcrumbItems } from './Products.helpers';
import noImage from '../../assets/no_image.jpg';
import { buildGenericGetAllRq, formatCurrency } from '../../app/Helpers';
import { IProductDetailsForm } from '../../interfaces/IProduct/IProduct';
import { useOrder } from '../../contexts/OrderContext';
import './productDetails.scss';
import { StarRating } from './StarRating';
import {
    ICreateReviewRequest,
    ICreateReviewResponse,
    IReviewGetAllResponse,
    IReviewList,
    IReviewListGetAllRequest,
} from '../../interfaces/IReview/IReview';
import { LocalStorage } from '../../app/LocalStorage';

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
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0);
    const [loading, setLoading] = useState(id ? true : false);
    const [submiting, setSubmiting] = useState(false);
    const { orderItems, addToOrder, removeFromOrder } = useOrder();
    const [reviews, setReviews] = useState<IReviewList[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const paginationAmount = 10;

    // Effects
    useEffect(() => {
        if (id) {
            API.get<IProductDetailsForm>('product/getDetails/' + id, {}).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    useEffect(() => {
        const rq: IReviewListGetAllRequest = { ...buildGenericGetAllRq(currentPage, null, undefined, paginationAmount), productId: id! };

        API.get<IReviewGetAllResponse>('review/getAll/', rq).then((r) => {
            const reviews = r.data.reviews.map((x) => {
                return {
                    ...x,
                };
            });
            setReviews(reviews);
            setTotalCount(r.data.totalCount);
        });
    }, [currentPage, id]);

    const handleSubmit = async () => {
        if (submiting) return;

        if (!comment) {
            Toast.warning('No puede ingresar un comentario vacío en la reseña.');
            return;
        }

        setSubmiting(true);

        API.post<ICreateReviewResponse, ICreateReviewRequest>(`review/create`, { ProductId: id!, Rate: rate, Description: comment })
            .then((r) => {
                if (r.message) Toast.success(r.message);
                setReviews((prevState) => [
                    {
                        description: comment,
                        rate: rate,
                        user: LocalStorage.getUserName(),
                        createdAt: 'Ahora',
                    },
                    ...prevState,
                ]);
                setComment('');
                setRate(0);
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(form.name)} title={form.name} />
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
                                                        <h5 className="text-danger">Out of stock</h5>
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
                                                        <Col xs={12} md={4}>
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
                                                                    Agregar a carrito
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
                    <Card
                        title="Reseñas"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    {reviews.length === 0 ? (
                                        <p>No se encontraron reseñas para este producto</p>
                                    ) : (
                                        <Row>
                                            {reviews.map((review, idx) => {
                                                return (
                                                    <Col key={idx} xs={12} className="p-3 border mb-3 shadow-sm bg-white w-100">
                                                        <Row>
                                                            <Col xs={6}>
                                                                <strong>{review.user}</strong>
                                                            </Col>

                                                            <Col xs={6} className="text-end">
                                                                <p>{review.createdAt}</p>
                                                            </Col>
                                                            <Col xs={12}>
                                                                <StarRating rate={review.rate} readOnly onChange={() => {}}></StarRating>
                                                            </Col>
                                                            <Col xs={12}>
                                                                <p className="mb-0">{review.description}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                );
                                            })}
                                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    itemsPerPage={paginationAmount}
                                                    totalCount={totalCount}
                                                    setCurrentPage={setCurrentPage}
                                                />
                                            </Col>
                                        </Row>
                                    )}
                                </>
                            )
                        }
                        footer={
                            <Row>
                                <Col xs={10}>
                                    <>
                                        <StarRating rate={rate} onChange={(v) => setRate(v)}></StarRating>
                                        <Input
                                            value={comment}
                                            className="mt-2"
                                            maxLength={350}
                                            tag="textarea"
                                            placeholder="Deja tu comentario..."
                                            onChange={(v) => setComment(v)}
                                        />
                                    </>
                                </Col>
                                <Col className="d-flex justify-content-end align-items-end" xs={2}>
                                    <Button onClick={handleSubmit} disabled={submiting}>
                                        {submiting ? <Loader /> : 'Enviar'}
                                    </Button>
                                </Col>
                            </Row>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default ProductDetails;
