import React from 'react';
import cs from '../Table/Table.module.css'

const TableHeader = ({name, value,sortBy, ...props}) => {

    return (
        <th className={cs.header} width={"50%"} onClick={e => sortBy(value)} {...props}>
            <p>
                {name}
            </p>
        </th>
    );
};

export default TableHeader;