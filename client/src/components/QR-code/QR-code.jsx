import React, {useState} from 'react';
import cs from './QR-code.module.css'
import qrImage from '../../image/qr.png'
import Modal from "../Modal/Modal";

const QrCode = () => {
    const [modalOpen, setModalOpen] = useState(false)
    return (
        <div className={cs.box}>
            <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <img className={cs.modalImg} src={qrImage}/>
            </Modal>
            <h2 className={cs.title}>
                QR код
            </h2>
            <img className={cs.img} src={qrImage} onClick={e => setModalOpen(true)}/>
        </div>
    );
};

export default QrCode;