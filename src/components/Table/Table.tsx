import * as BS from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Pagination } from '@components';
import './table.scss';
import { ReactNode } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CategoryListInterface } from '../../interfaces';

// interface RowInterface
//     extends Omit<Record<string, string | string[]>, 'disabled' | 'href' | 'isSelected' | 'style'> {
//     disabled?: boolean;
//     href?: string;
//     isSelected?: boolean;
//     style?: CSSProperties;
// }

interface ColumnInterface {
    name: string;
    text: string;
    textCenter?: boolean;
    className?: string;
    bold?: boolean;
    boldRow?: boolean;
    clickableColumn?: boolean;
    list?: boolean;
    icon?: IconProp;
    formatter?: (name: string, row: CategoryListInterface) => string;
    component?: (props: {
        row: CategoryListInterface;
        disabled?: boolean;
        onClick: (e: React.MouseEvent) => void;
        onUpdate: () => void;
    }) => ReactNode;
}

interface TableProps {
    columns: ColumnInterface[];
    rows: CategoryListInterface[];
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

const Table: React.FC<TableProps> = ({
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
}) => {
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

    const tableClassNames = classNames(
        'table',
        bordered && 'table-bordered',
        striped && 'table-striped',
        hover && 'table-hover',
        className
    );

    return (
        <div className={`table-responsive px-1`}>
            <BS.Table className={tableClassNames}>
                <thead>
                    <tr>
                        {columns &&
                            columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={classNames(
                                        col.textCenter && 'text-center',
                                        col.className
                                    )}
                                >
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
                                          const isClickable = col.clickableColumn
                                              ? 'clickable-row'
                                              : '';

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
                                                  onClick={(e) =>
                                                      handleColClick(e, col.clickableColumn)
                                                  }
                                              >
                                                  {!col.component ? (
                                                      col.list && Array.isArray(row[col.name]) ? (
                                                          <ul
                                                              className="mb-0"
                                                              style={{
                                                                  maxHeight: '100px',
                                                                  overflowY: 'auto',
                                                              }}
                                                          >
                                                              {(row[col.name] as string[]).map(
                                                                  (item: string, k: number) => (
                                                                      <li key={k}>{item}</li>
                                                                  )
                                                              )}
                                                          </ul>
                                                      ) : col.boldRow ? (
                                                          <h6 className="mb-0">
                                                              {col.formatter
                                                                  ? col.formatter(
                                                                        row[col.name] as string,
                                                                        row
                                                                    )
                                                                  : row[col.name]}
                                                          </h6>
                                                      ) : col.formatter ? (
                                                          col.formatter(
                                                              row[col.name] as string,
                                                              row
                                                          )
                                                      ) : (
                                                          row[col.name]
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
                    <Pagination
                        currentPage={currentPage}
                        totalCount={totalCount}
                        setCurrentPage={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Table;
