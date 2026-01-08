
import { Icon } from './Images';

export function CollapsibleHeader(props: {icon: string | undefined, title: string, link?: React.ReactElement<any>}) {
    return (
        <div className='collapsibleTrigger'>
            {props.icon && <Icon size='sm' src={ props.icon } title={props.title} />}
            <span style={{paddingLeft: props.icon ? '0' : '.5em' }}>{props.title}</span>
            {props.link && props.link}
        </div>
    );
}