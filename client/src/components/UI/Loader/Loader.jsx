import React from 'react';
import cs from './Loader.module.css'

const Loader = ({small=false}) => {

    if (small === true) {
        return (
            <div className={cs.roller + ' ' + cs.small}>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    }
    return (
        <div className={cs.window}>
            <div className={cs.roller}>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    );
};

export default Loader;