import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Loader, Pagination, Spinner, Toast } from '../../components';
import { Col, Row } from 'react-bootstrap';
import { StarRating } from './StarRating';
import {
    ICreateReviewRequest,
    ICreateReviewResponse,
    IReviewGetAllResponse,
    IReviewList,
    IReviewListGetAllRequest,
} from '../../interfaces/IReview/IReview';
import { buildGenericGetAllRq } from '../../app/Helpers';
import API from '../../app/API';
import { LocalStorage } from '../../app/LocalStorage';

type ReviewsCardProps = {
    loading?: boolean;
    id: string;
};

export const ReviewsCard: React.FC<ReviewsCardProps> = ({ loading, id }) => {
    const [reviews, setReviews] = useState<IReviewList[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0);
    const [submiting, setSubmiting] = useState(false);

    const paginationAmount = 10;
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
                                                    <StarRating
                                                        rate={review.rate}
                                                        totalReviews={totalCount}
                                                        readOnly
                                                        onChange={() => {}}
                                                    ></StarRating>
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
                    <Col xs={12} md={10}>
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
                    <Col className="d-flex justify-content-end align-items-end mt-3 mt-md-0" md={2}>
                        <Button onClick={handleSubmit} disabled={submiting}>
                            {submiting ? <Loader /> : 'Enviar'}
                        </Button>
                    </Col>
                </Row>
            }
        />
    );
};
