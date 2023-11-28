import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { EventsSE } from './se/page';
import { EventsStarland } from './starland/page';


export function BigEvents(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    //rng&ff&shelter&imp&gala&hs&po&wc
    return (
        <div className='ihContainer'>
            <Collapsible open={isOpen('se')} trigger={<CollapsibleHeader title="Star Expedition" icon={ImageSrc.event('se')} link={<SectionLink onClick={() => setSearchParams('se')}/>}/>} {...options}>
                <EventsSE />
            </Collapsible>
            <Collapsible open={isOpen('starland')} trigger={<CollapsibleHeader title="Starland" icon={ImageSrc.event('starland')} link={<SectionLink onClick={() => setSearchParams('starland')}/>}/>} {...options}>
                <EventsStarland />
            </Collapsible>
        </div>
    );
}