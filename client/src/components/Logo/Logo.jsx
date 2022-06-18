import React from 'react';
import cs from './Logo.module.css'
import imageLogo from '../../image/logo.png'

const Logo = () => {
    return (
        <div className={cs.logo}>
            <img className={cs.image} src={imageLogo}/>
            <p className={cs.text}>
                моё общежитие
            </p>
        </div>
    );
};

export default Logo;