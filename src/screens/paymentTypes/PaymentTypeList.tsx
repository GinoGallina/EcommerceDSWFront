import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import API from '../../app/API';
import { buildGenericGetAllRq } from '../../app/Helpers';

import { columns, sortCategoryItems } from './PaymentType.data';
import { ColumnComponentType, IColumn } from '../../interfaces/shared/ITable';
import { ISortRequest } from '../../interfaces';
import { IPaymentTypeList, IPaymentTypeResponse } from '../../interfaces/IPaymentType/IPaymentType';

const PaymentTypeList = () => {
    const navigate = useNavigate();

    const paymentTypesColumns: IColumn<IPaymentTypeList>[] = [
        ...columns,
        {
            name: '',
            text: 'Acciones',
            component: (props: ColumnComponentType<IPaymentTypeList>) => <ActionButtons {...props} female entity="paymentType" />,
            className: 'text-center',
        },
    ];

    // States
    const [paymentTypes, setPaymentTypes] = useState<IPaymentTypeList[]>([]);

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);

    const categoriesBreadCrums = [
        {
            label: 'Métodos de pago',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq = buildGenericGetAllRq(currentPage, sort);

        API.get<IPaymentTypeResponse>('paymentType/getAll', rq).then((r) => {
            const categories = r.data.paymentTypes.map((x) => {
                return {
                    ...x,
                    endpoint: 'paymentType',
                };
            });
            setPaymentTypes(categories);
            setTotalCount(r.data.totalCount);
            if (categories.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    // Handlers
    const handleFilterPaymentTypes = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    const updateDeletedRow = (id: string) => {
        setPaymentTypes((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Métodos de pago" />
            <Col xs={11} className="container">
                <Card
                    title="Métodos de pago"
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort items={sortCategoryItems} onChange={handleSortChange} />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 pe-3">
                                    <Input showIcon borderless placeholder="Buscar" value={nameFilter} onChange={handleFilterPaymentTypes} />
                                </Col>
                            </Row>
                            <Table
                                className="mb-5"
                                columns={paymentTypesColumns}
                                rows={paymentTypes.filter((x) => x.name.toLowerCase().includes(nameFilter.toLowerCase()))}
                                emptyTableMessage="No se encontraron metodos de pago"
                                pagination={true}
                                currentPage={currentPage}
                                totalCount={totalCount}
                                onPageChange={handlePageChange}
                                onUpdate={updateDeletedRow}
                            />
                        </>
                    }
                    footer={
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => navigate('/metodosPago/new')} variant="primary">
                                Nuevo método de pago
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default PaymentTypeList;
