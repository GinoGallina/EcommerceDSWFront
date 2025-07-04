import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import { myProductCols, sortMyProductItems } from './Products.data';
import { ColumnComponentType, IColumn } from '../../interfaces/shared/ITable';
import { buildGenericGetAllRq } from '../../app/Helpers';
import API from '../../app/API';
import { ISortRequest } from '../../interfaces';
import { IMyProductList, IProductList, IProductListGetAllResponse } from '../../interfaces/IProduct/IProduct';
import App from '../../app/App';

const MyProductList = () => {
    const navigate = useNavigate();

    // States
    const [products, setProducts] = useState<IProductList[]>([]);

    // Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);
    const [nameFilter, setNameFilter] = useState('');

    const productsBreadCrums = [
        {
            label: App.isAdmin() ? 'Todos los productos' : 'Mis productos',
            active: true as const,
        },
    ];

    const productColumns: IColumn<IMyProductList>[] = [
        ...myProductCols,
        {
            name: '',
            text: 'Acciones',
            component: (props: ColumnComponentType<IMyProductList>) => <ActionButtons {...props} canDelete={true} entity="producto" />,
            className: 'text-center',
        },
    ];

    // Effects
    useEffect(() => {
        const rq = buildGenericGetAllRq(currentPage, sort);

        API.get<IProductListGetAllResponse>('product/getAllMyProducts', rq).then((r) => {
            const products = r.data.products.map((x) => {
                return {
                    ...x,
                    endpoint: 'product',
                };
            });
            setProducts(products);
            setTotalCount(r.data.totalCount);
            if (products.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    // Handlers
    const handleFilterProducts = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    const updateDeletedRow = (id: string) => {
        setProducts((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={productsBreadCrums} title={App.isAdmin() ? 'Todos los productos' : 'Mis productos'} />
            <Col xs={11} className="container">
                <Card
                    title={App.isAdmin() ? 'Todos los productos' : 'Mis productos'}
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort items={sortMyProductItems} onChange={handleSortChange} />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 pe-3">
                                    <Input showIcon borderless placeholder="Buscar" value={nameFilter} onChange={handleFilterProducts} />
                                </Col>
                            </Row>
                            <Table<IProductList>
                                className="mb-5"
                                columns={productColumns}
                                rows={products.filter((x) => x.name.toLowerCase().includes(nameFilter.toLowerCase()))}
                                emptyTableMessage="No se encontraron productos"
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
                            <Button onClick={() => navigate('/misProductos/new')} variant="primary">
                                Nuevo producto
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default MyProductList;
