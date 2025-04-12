import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import API from '../../../app/API';
import Toast from '../../Toast/Toast';

interface DeleteConfirmationModalProps {
    disabled?: boolean;
    item: string;
    message: string;
    onConfirm: (id: string) => void;
}

export interface DeleteConfirmationModalRef {
    open: (id: string, endpoint: string) => void;
}

const DeleteConfirmationModal = forwardRef<DeleteConfirmationModalRef, DeleteConfirmationModalProps>(
    ({ disabled = false, item, message, onConfirm = () => {} }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const [id, setId] = useState('');
        const [endpoint, setEndpoint] = useState('');

        useImperativeHandle(ref, () => ({
            open,
        }));

        const open = (id: string, endpoint: string) => {
            setId(id);
            setEndpoint(endpoint);
            setIsVisible(true);
        };

        const handleConfirm = () => {
            API.post(`${endpoint}/delete`, { Id: id }).then((r) => {
                Toast.success(r.message || '');
                handleClose();
                if (onConfirm) onConfirm(id);
            });
        };

        const handleClose = () => {
            setIsVisible(false);
        };

        if (!isVisible) return null;

        return (
            <Modal size="lg" centered show={isVisible} onHide={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>¿Seguro deseas eliminar {item}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">
                        <b>{message}</b>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button link onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirm} disabled={disabled}>
                        {disabled ? <Loader /> : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
);

export default DeleteConfirmationModal;
