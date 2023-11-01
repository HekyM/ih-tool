import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { Eggs } from './voidark/page';


export function Daylies(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    return (
        <div className='ihContainer'>
            <Collapsible open={true || isOpen('eggs')} trigger={<CollapsibleHeader title="Void Ark | Eggs" icon={ImageSrc.layout('void-ark')} link={<SectionLink onClick={() => setSearchParams('eggs')}/>}/>} {...options}>
                <Eggs />
            </Collapsible>
        </div>
    );
}