import * as BS from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IColumn, RowsType } from '../../interfaces';
import Pagination from '../Pagination/Pagination';
import './table.scss';

interface TableProps<T> {
    columns: IColumn<T>[];
    rows: RowsType<T>;
    className?: string;
    emptyTableMessage: string;
    clickable?: boolean;
    pagination?: boolean;
    bordered?: boolean;
    striped?: boolean;
    hover?: boolean;
    loading?: boolean;
    //TODO: TIENEN QUE ESTAR SI PAGINATION ES TRUE
    totalCount?: number;
    currentPage?: number;
    onRowClick?: (e: React.MouseEvent, href: string | null) => void;
    onCellClick?: (e: React.MouseEvent) => void;
    onPageChange?: (page: number) => void;
    onUpdate?: (id: string) => void;
}

const Table = <T extends { id: string }>({
    columns,
    rows = [],
    className = '',
    emptyTableMessage = '',
    clickable = false,
    pagination = false,
    bordered = true,
    striped = true,
    hover = true,
    loading = false,
    totalCount = 0,
    currentPage = 1,
    onRowClick = () => {},
    onCellClick = () => {},
    onPageChange = () => {},
    onUpdate = () => {},
}: TableProps<T>) => {
    const handlePageChange = (page: number) => {
        onPageChange(page);
    };
    const handleCellClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCellClick(e);
    };

    const handleRowClick = (e: React.MouseEvent) => {
        if (!clickable) return;

        const target = e.target as HTMLElement;
        const row = target.closest('tr');
        if (row) {
            onRowClick(e, row.getAttribute('data-href'));
        }
    };

    //TDOD: CHECK SI ES LO MISMO??
    const handleColClick = (e: React.MouseEvent, canClick: boolean = false) => {
        if (!canClick) return;

        const target = e.target as HTMLElement;
        const row = target.closest('tr');
        if (row) {
            onRowClick(e, row.getAttribute('data-href'));
        }
    };

    const tableClassNames = classNames('table', bordered && 'table-bordered', striped && 'table-striped', hover && 'table-hover', className);

    return (
        <div className={`table-responsive px-1`}>
            <BS.Table className={tableClassNames}>
                <thead>
                    <tr>
                        {columns &&
                            columns.map((col, i) => (
                                <th key={i} className={classNames(col.textCenter && 'text-center', col.className)}>
                                    {col.bold ? <strong>{col.text}</strong> : col.text}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length && !loading
                        ? rows.map((row, i) => (
                              <tr
                                  key={i}
                                  style={row.style}
                                  data-href={row.href}
                                  className={`${clickable ? 'clickable-row' : ''} ${row.isSelected ? 'selected-row' : ''}`}
                                  onClick={handleRowClick}
                              >
                                  {columns &&
                                      columns.map((col, j) => {
                                          let value;

                                          if (col.name) value = row[col.name];

                                          const isClickable = col.clickableColumn ? 'clickable-row' : '';

                                          if (col.name === 'icon' && col.icon)
                                              return (
                                                  <td
                                                      key={j}
                                                      className={classNames(col.className, {
                                                          [isClickable]: isClickable,
                                                      })}
                                                  >
                                                      <span className="table-icon-container">
                                                          <FontAwesomeIcon icon={col.icon} />
                                                      </span>
                                                  </td>
                                              );

                                          return (
                                              <td
                                                  key={j}
                                                  className={classNames(col.className, {
                                                      [isClickable]: isClickable,
                                                  })}
                                                  onClick={(e) => handleColClick(e, col.clickableColumn)}
                                              >
                                                  {!col.component ? (
                                                      col.list && Array.isArray(value) ? (
                                                          <ul
                                                              className="mb-0"
                                                              style={{
                                                                  maxHeight: '100px',
                                                                  overflowY: 'auto',
                                                              }}
                                                          >
                                                              {value.map((item: string, k: number) => (
                                                                  <li key={k}>{item}</li>
                                                              ))}
                                                          </ul>
                                                      ) : col.boldRow ? (
                                                          <h6 className="mb-0">
                                                              {col.formatter ? col.formatter(value as string, row) : (value as string)}
                                                          </h6>
                                                      ) : col.formatter ? (
                                                          col.formatter(value as string, row)
                                                      ) : (
                                                          (value as string)
                                                      )
                                                  ) : (
                                                      col.component({
                                                          row,
                                                          disabled: row.disabled,
                                                          onClick: handleCellClick,
                                                          onUpdate,
                                                      })
                                                  )}
                                              </td>
                                          );
                                      })}
                              </tr>
                          ))
                        : null}
                    {rows.length === 0 && emptyTableMessage && !loading && (
                        <tr>
                            <td colSpan={columns.length} className="text-start">
                                {emptyTableMessage}
                            </td>
                        </tr>
                    )}
                    {loading && (
                        <tr>
                            <td colSpan={columns.length} className="text-center">
                                <span className="loader"></span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </BS.Table>
            {pagination && rows && (
                <div className="d-flex justify-content-end">
                    <Pagination currentPage={currentPage} totalCount={totalCount} setCurrentPage={handlePageChange} />
                </div>
            )}
        </div>
    );
};

export default Table;
