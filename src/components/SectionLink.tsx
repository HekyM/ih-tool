import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

export function SectionLink(props: {onClick: () => void}) {
    return (
        <FontAwesomeIcon 
            icon={faLink} color='gray' 
            style={{width: '1em', marginTop: 'auto', marginBottom: 'auto', padding: '.4em'}} 
            onClick={(e) => {
                e.stopPropagation(); 
                props.onClick();
            }}/>
    )
}