import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, Spinner } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItems } from '../products/Products.helpers';
import { CategoryFormInterface } from '../../interfaces';

const CreateCategory = ({ isWatching = false, isEditing = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.Category);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    // Effects
    useEffect(() => {
        if (id) {
            API.get<CategoryFormInterface>('category/getOneById', { id }).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        //ver stock y price
        if (!form.name) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq: {
            id?: string;
            name: string;
        } = {
            name: form.name,
        };

        if (id) {
            rq.id = id;
        }

        API.post(`category/${id ? 'update' : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/categorias/list');
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
        // saveProduct(
        //     form,
        //     id,
        //     () => {
        //         navigate('/productos/list');
        //     },
        //     () => {
        //         setSubmiting(false);
        //     }
        // );
    };

    const handleInputChange = (value: string, field: string) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    // if (!App.isSeller()) {
    //     return navigate('/notAllowed');
    // }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? 'Editar' : 'Nuevo')} title="Categorias" />
            <div>
                <Col xs={11} className="container">
                    <Card
                        title="Categoria"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Nombre</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Nombre"
                                                value={form.name}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'name')
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={() => navigate('/categorias/list')}
                                >
                                    Volver
                                </Button>
                                {!isWatching && (
                                    <Button onClick={handleSubmit} disabled={submiting}>
                                        {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                    </Button>
                                )}
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default CreateCategory;
