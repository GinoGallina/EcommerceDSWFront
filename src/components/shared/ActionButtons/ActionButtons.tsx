import { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import App from '../../../app/App';
import Tooltip from '../../Tooltip/Tooltip';
import './ActionButtons.scss';
import { RowType } from '../../../interfaces';
import DeleteConfirmationModal, { DeleteConfirmationModalRef } from '../DeleteConfirmationModal/DeleteConfirmationModal';

export interface ActionButtonsProps {
    row: RowType;
    canDelete?: boolean;
    showEdit?: boolean;
    showWatch?: boolean;
    entity?: string;
    female?: boolean;
    navigateTo?: boolean;
    onUpdate?: (id: string) => void;
    onWatch?: (id: string) => void;
    onEdit?: (id: string) => void;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({
    row,
    canDelete = App.isAdmin(),
    showEdit = true,
    showWatch = true,
    entity = 'entidad',
    female = false,
    navigateTo = true,
    onUpdate = () => {},
    onWatch = () => {},
    onEdit = () => {},
}) => {
    const navigate = useNavigate();
    const id = row.id;
    const endpoint = row.endpoint;

    const deleteModalRef = useRef<DeleteConfirmationModalRef | null>(null);

    const handleWatch = () => {
        if (navigateTo) navigate(window.location.pathname.replace(/\/[^/]+$/, `/${id}`));
        else onWatch(id);
    };

    const handleEdit = () => {
        if (navigateTo) navigate(window.location.pathname.replace(/\/[^/]+$/, `/edit/${id}`));
        else onEdit(id);
    };

    const handleDelete = () => {
        if (deleteModalRef.current) deleteModalRef.current.open(id, endpoint);
    };

    return (
        <>
            <DeleteConfirmationModal
                item={`est${female ? 'a' : 'e'} ${entity}`}
                message={`Esta acción se puede deshacer. Una vez eliminad${female ? 'a' : 'o'} ${female ? 'la' : 'el'} ${entity}, el producto se podrá recuperar.`}
                onConfirm={() => onUpdate(row.id)}
                ref={deleteModalRef}
            />
            <Row>
                <Col className="action-button--container">
                    {showWatch && (
                        <Tooltip text="Ver" placement="top">
                            <FontAwesomeIcon className="action-button" icon={faEye} color="black" onClick={handleWatch} />
                        </Tooltip>
                    )}
                    {showEdit && (
                        <Tooltip text="Editar" placement="top">
                            <FontAwesomeIcon className="action-button" icon={faPencil} color="black" onClick={handleEdit} />
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip text="Eliminar" placement="top">
                            <FontAwesomeIcon className="action-button action-button--delete" icon={faTrashAlt} color="red" onClick={handleDelete} />
                        </Tooltip>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default ActionButtons;
