
import { Icon } from './Images';

export function CollapsibleHeader(props: {icon: string, title: string, link?: React.ReactElement<any>}) {
    return (
        <div className='collapsibleTrigger'>
            <Icon size='sm' src={ props.icon } title={props.title} />
            <span>{props.title}</span>
            {props.link && props.link}
        </div>
    );
}