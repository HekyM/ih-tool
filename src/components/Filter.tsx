import React, { useState } from 'react';
import { Icon } from './Images';
import { Dropdown } from './Dropdown';

interface FilterProps extends React.PropsWithChildren {
    items: {
        [key: string]: string;
    };
    default: string;
    titles?: boolean;
    onSelected?: (key: string) => void;
}

export function Filter(props: FilterProps) {
    const [selected, setSelected] = useState(props.default);

    const select = (item: string): void => {
        setSelected(item);
        props.onSelected?.(item);
    }
    return (
        <Dropdown autoClose={true} trigger={<Icon src={props.items[selected]} alt={selected}/>}>
            <div className='icons-picker floated'>
                {Object.keys(props.items).map(key => 
                    <Icon key={'filter-'+props.items[key]} 
                        src={props.items[key]}
                        alt={key}
                        title={props.titles ? key : undefined}
                        onClick={() => select(key)}
                    />
                )}
            </div>
        </Dropdown>
    )
}