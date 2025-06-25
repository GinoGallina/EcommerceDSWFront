import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Input, Loader, Pagination, Spinner, Toast } from '../../../components';
import { Col, Row } from 'react-bootstrap';
import { StarRating } from './StarRating';
import {
    ICreateReviewRequest,
    ICreateReviewResponse,
    IReviewGetAllResponse,
    IReviewList,
    IReviewListGetAllRequest,
} from '../../../interfaces/IReview/IReview';
import { buildGenericGetAllRq } from '../../../app/Helpers';
import API from '../../../app/API';
import { LocalStorage } from '../../../app/LocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal, { DeleteConfirmationModalRef } from '../../../components/shared/DeleteConfirmationModal/DeleteConfirmationModal';
import App from '../../../app/App';
import './reviewCard.scss';

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

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editComment, setEditComment] = useState('');
    const [editingRate, setEditingRate] = useState<number>(0);

    const paginationAmount = 10;
    const deleteModalRef = useRef<DeleteConfirmationModalRef | null>(null);

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

    const handleSubmit = async (reviewId: string | null = null) => {
        if (submiting) return;

        if (!reviewId && !comment) {
            Toast.warning('No puede ingresar un comentario vacío en la reseña.');
            return;
        }
        if (reviewId && !editComment) {
            Toast.warning('No puede ingresar un comentario vacío en la reseña.');
            return;
        }

        setSubmiting(true);

        API.post<ICreateReviewResponse, ICreateReviewRequest>(`review/${reviewId ? 'update/' + reviewId : 'create'}`, {
            ProductId: id!,
            Rate: reviewId ? editingRate : rate,
            Description: reviewId ? editComment : comment,
        })
            .then((r) => {
                if (r.message) Toast.success(r.message);
                if (!reviewId)
                    setReviews((prevState) => [
                        {
                            id: r.data.id,
                            description: comment,
                            rate: rate,
                            user: LocalStorage.getUserName(),
                            userId: LocalStorage.getUserId(),
                            createdAt: 'Ahora',
                        },
                        ...prevState,
                    ]);
                else
                    setReviews((prevState) =>
                        prevState.map((x) => {
                            if (x.id.toString() !== reviewId.toString()) return x;
                            return {
                                ...x,
                                rate: editingRate,
                                description: editComment,
                            };
                        })
                    );
                setEditingId(null);
                setComment('');
                setRate(0);
                setEditComment('');
                setEditingRate(0);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleDeleteReview = (id: string) => {
        if (deleteModalRef.current) {
            deleteModalRef.current.open(id, 'review');
        }
    };

    return (
        <>
            <DeleteConfirmationModal
                item={`esta reseña`}
                message={`Esta acción no se puede deshacer. Una vez eliminada la reseña no se podrá recuperar.`}
                onConfirm={(revId) => {
                    setReviews((prevState) => prevState.filter((x) => x.id.toString() !== revId));
                }}
                ref={deleteModalRef}
            />
            <Card
                title="Reseñas"
                className="reviews"
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
                                                            rate={editingId?.toString() !== review.id.toString() ? review.rate : editingRate}
                                                            totalReviews={totalCount}
                                                            readOnly={editingId?.toString() !== review.id.toString()}
                                                            onChange={(value) => setEditingRate(value)}
                                                        />
                                                    </Col>
                                                    {editingId?.toString() === review.id.toString() ? (
                                                        <>
                                                            <Input
                                                                value={editComment}
                                                                className="mt-2"
                                                                maxLength={350}
                                                                tag="textarea"
                                                                placeholder="Deja tu comentario..."
                                                                onChange={(v) => setEditComment(v)}
                                                            />
                                                            <Button className="my-3" onClick={() => handleSubmit(review.id)} disabled={submiting}>
                                                                {submiting ? <Loader /> : 'Enviar'}
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingId(null);
                                                                    setEditingRate(0);
                                                                    setEditComment('');
                                                                }}
                                                                variant="danger"
                                                                disabled={submiting}
                                                            >
                                                                {submiting ? <Loader /> : 'Cancelar'}
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Col xs={12} className="d-flex justify-content-between">
                                                            <p className="mb-0 d-inline" style={{ flex: 1 }}>
                                                                {review.description}
                                                            </p>
                                                            {LocalStorage.getUserId() === review.userId.toString() && (
                                                                <FontAwesomeIcon
                                                                    className="pencil-icon me-3"
                                                                    icon={faPencil}
                                                                    onClick={() => {
                                                                        setEditComment(review.description);
                                                                        setEditingRate(review.rate);
                                                                        setEditingId(review.id);
                                                                    }}
                                                                />
                                                            )}
                                                            {(App.isAdmin() || LocalStorage.getUserId() === review.userId.toString()) && (
                                                                <FontAwesomeIcon
                                                                    className="trash-icon"
                                                                    color="red"
                                                                    icon={faTrash}
                                                                    onClick={() => handleDeleteReview(review.id)}
                                                                />
                                                            )}
                                                        </Col>
                                                    )}
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
                            <Button onClick={() => handleSubmit()} disabled={submiting}>
                                {submiting ? <Loader /> : 'Enviar'}
                            </Button>
                        </Col>
                    </Row>
                }
            />
        </>
    );
};
