import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Card, Input, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { Messages } from '../../app/constants/Messages';
import API from '../../app/API';
import { buildGenericGetAllRq, formatCurrency } from '../../app/Helpers';
import { IOrderList, IGetAllOrdersResponse } from '../../interfaces/IOrder/IOrder';
import { getAllOrderCols, sortSortItems } from './Order.data';
import { ColumnComponentType, IColumn } from '../../interfaces/shared/ITable';
import { ISortRequest } from '../../interfaces';
import App from '../../app/App';
import { getStatus } from './Order.helpers';

const OrderList = () => {
    const ordersColumns: IColumn<IOrderList>[] = [
        ...getAllOrderCols(),
        {
            text: 'Estado',
            name: 'status',
            className: 'text-center',
            component: (props) => {
                const { value, color } = getStatus(props.row.status);
                return <span style={{ color, fontWeight: 'bold' }}>{value}</span>;
            },
        },
        {
            text: 'Total',
            name: 'totalAmount',
            className: 'text-center',
            formatter: (value: string) => formatCurrency(value),
        },
        {
            name: '',
            text: 'Acciones',
            component: (props: ColumnComponentType<IOrderList>) => (
                <ActionButtons {...props} showEdit={false} canDelete={false} female entity="order" />
            ),
            className: 'text-center',
        },
    ];

    // States
    const [orders, setOrder] = useState<IOrderList[]>([]);

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);

    const ordersBreadCrums = [
        {
            label: App.isUser() ? 'Mis compras' : 'Compras',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq = buildGenericGetAllRq(currentPage, sort);

        API.get<IGetAllOrdersResponse>('order/getAll', rq).then((r) => {
            const orders = r.data.orders.map((x) => {
                return {
                    ...x,
                    endpoint: 'order',
                };
            });
            setOrder(orders);
            setTotalCount(r.data.totalCount);
            if (orders.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    // Handlers
    const handleFilterorders = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    return (
        <>
            <BreadCrumb items={ordersBreadCrums} title={App.isUser() ? 'Mis compras' : 'Compras'} />
            <Col xs={11} className="container">
                <Card
                    title={App.isUser() ? 'Mis compras' : 'Compras'}
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort items={sortSortItems} onChange={handleSortChange} />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 pe-3">
                                    <Input showIcon borderless placeholder="Buscar" value={nameFilter} onChange={handleFilterorders} />
                                </Col>
                            </Row>
                            <Table
                                className="mb-5"
                                columns={ordersColumns}
                                rows={orders}
                                emptyTableMessage="No se encontraron compras"
                                pagination={true}
                                currentPage={currentPage}
                                totalCount={totalCount}
                                onPageChange={handlePageChange}
                            />
                        </>
                    }
                />
            </Col>
        </>
    );
};

export default OrderList;
