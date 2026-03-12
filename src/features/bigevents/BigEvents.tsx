import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { EventsSE } from './se/page';
import { EventsStarland } from './starland/page';
import { EventsFW } from './fw/page';
import { EventsSwordEdgeArena } from './searena/page';
import { EventsRealmClash } from './realmclash/page';


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
            {/*
            <Collapsible open={isOpen('starland')} trigger={<CollapsibleHeader title="Starland" icon={ImageSrc.event('starland')} link={<SectionLink onClick={() => setSearchParams('starland')}/>}/>} {...options}>
                <EventsStarland />
            </Collapsible>
            */}
            <Collapsible open={isOpen('fw')} trigger={<CollapsibleHeader title="Force War" icon={ImageSrc.event('fw')} link={<SectionLink onClick={() => setSearchParams('fw')}/>}/>} {...options}>
                <EventsFW />
            </Collapsible>
            <Collapsible open={isOpen('sword')} trigger={<CollapsibleHeader title="Sword Edge Arena" icon={ImageSrc.events('searena', 'arena-store-token')} link={<SectionLink onClick={() => setSearchParams('sword')}/>}/>} {...options}>
                <EventsSwordEdgeArena />
            </Collapsible>
            <Collapsible open={isOpen('realm-clash')} trigger={<CollapsibleHeader title="Ethereal Realm - Realm Clash" icon={ImageSrc.events('realm-clash', 'chest-gold')} link={<SectionLink onClick={() => setSearchParams('realmclash')}/>}/>} {...options}>
                <EventsRealmClash />
            </Collapsible>
        </div>
    );
}