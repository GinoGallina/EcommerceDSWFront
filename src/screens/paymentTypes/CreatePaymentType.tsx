import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, Spinner } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItems } from './PaymentType.helpers';
import { IPaymentTypeCreateRequest, IPaymentTypeCreateResponse, IPaymentTypeForm } from '../../interfaces/IPaymentType/IPaymentType';
import { trimStrings } from '../../app/Helpers';

const CreatePaymentType = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.PaymentType);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    // Effects
    useEffect(() => {
        if (id) {
            API.get<IPaymentTypeForm>('paymentType/getOne/' + id, {}).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        if (!form.name) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq: IPaymentTypeCreateRequest = trimStrings({
            Name: form.name,
        });

        API.post<IPaymentTypeCreateResponse, IPaymentTypeCreateRequest>(`paymentType/${id ? `update/${id}` : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/metodosPago/list');
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleInputChange = (value: string, field: string) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? (isWatching ? 'Ver' : 'Editar') : 'Nuevo')} title="Métodos de pago" />
            <div>
                <Col xs={11} className="container">
                    <Card
                        title="Método de pago"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row className="align-items-center">
                                        <Col xs={12} className="mb-3 pe-3">
                                            <Label required>Descripción</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Descripción"
                                                value={form.name}
                                                onChange={(value) => handleInputChange(value, 'name')}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="me-2" onClick={() => navigate('/metodosPago/list')}>
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

export default CreatePaymentType;
