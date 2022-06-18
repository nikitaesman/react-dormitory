import React from 'react';
import cs from './Modal.module.css'

const Modal = ({children, modalOpen, setModalOpen, complication = false}) => {

    function closeModal(comp = false) {
        if (complication === true) {
            if (comp === true) {
                setModalOpen(prev => !prev)
            }
        }else {
            setModalOpen(prev => !prev)
        }
    }
    return (
        <div className={modalOpen ? cs.modalBox + ' ' + cs.modalOpen : cs.modalBox + ' ' + cs.modalClose} onClick={closeModal}>
            <div className={cs.modalContainer} onClick={e => e.stopPropagation()}>
                {children}
                <div className={complication ? cs.close : cs.close + " " + cs.closeNoVid} onClick={e => closeModal(true)}>
                    <div className={cs.closeArrow}/>
                    <div className={cs.closeArrow}/>
                </div>
            </div>
        </div>
    );
};

export default Modal;