import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import API from '../../app/API';
import { buildGenericGetAllRq } from '../../app/Helpers';
import { ICategoryList, IGetAllCategoryResponse } from '../../interfaces/ICategory/ICategory';
import { columns, sortCategoryItems } from './Categroy.data';
import { ColumnComponentType, IColumn } from '../../interfaces/shared/ITable';
import { ISortRequest } from '../../interfaces';
import { useDebounce } from '../../hooks/useDebounce';

const CategoryList = () => {
    const navigate = useNavigate();

    const categoryColumns: IColumn<ICategoryList>[] = [
        ...columns,
        {
            name: '',
            text: 'Acciones',
            component: (props: ColumnComponentType<ICategoryList>) => <ActionButtons {...props} female entity="categoría" />,
            className: 'text-center',
        },
    ];

    // States
    const [categories, setCategories] = useState<ICategoryList[]>([]);

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);
    const debouncedText = useDebounce(nameFilter, 300);

    const categoriesBreadCrums = [
        {
            label: 'Categorias',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq = buildGenericGetAllRq(currentPage, sort);

        rq.text = debouncedText;

        API.get<IGetAllCategoryResponse>('category/getAll', rq).then((r) => {
            const categories = r.data.categories.map((x) => {
                return {
                    ...x,
                    endpoint: 'category',
                };
            });
            setCategories(categories);
            setTotalCount(r.data.totalCount);
            if (categories.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, debouncedText, sort]);

    // Handlers
    const handleFilterCategories = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    const updateDeletedRow = (id: string) => {
        setCategories((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Categorias" />
            <Col xs={11} className="container">
                <Card
                    title="Categorias"
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort items={sortCategoryItems} onChange={handleSortChange} />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 pe-3">
                                    <Input showIcon borderless placeholder="Buscar" value={nameFilter} onChange={handleFilterCategories} />
                                </Col>
                            </Row>
                            <Table<ICategoryList>
                                className="mb-5"
                                columns={categoryColumns}
                                rows={categories}
                                emptyTableMessage="No se encontraron categorias"
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
                            <Button onClick={() => navigate('/categorias/new')} variant="primary">
                                Nueva categoria
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default CategoryList;
