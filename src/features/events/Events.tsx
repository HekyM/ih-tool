import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { EventsFF } from './ff/page';
import { EventsGala } from './gala/page';
import { EventsHS } from './hs/page';
import { EventsPO } from './po/page';
import { EventsWC } from './wc/page';
import { EventsGotchaRNG } from './rng/page';
import { EventsPityRNG } from './pity/page';
import { Shelter } from './shelter/page';
import { Imp } from './imp/page';


export function Events(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    //rng&ff&shelter&imp&gala&hs&po&wc
    return (
        <div className='ihContainer'>
            <Collapsible open={isOpen('rng')} trigger={<CollapsibleHeader title="RNG Gotcha" icon={ImageSrc.layout('rng')} link={<SectionLink onClick={() => setSearchParams('rng')}/>}/>} {...options}>
                <EventsGotchaRNG />
            </Collapsible>
            <Collapsible open={isOpen('pity')} trigger={<CollapsibleHeader title="RNG Pity timer" icon={ImageSrc.layout('pity')} link={<SectionLink onClick={() => setSearchParams('pity')}/>}/>} {...options}>
                <EventsPityRNG />
            </Collapsible>
            <Collapsible open={isOpen('ff')} trigger={<CollapsibleHeader title="Fantasy Factory" icon={ImageSrc.resources('ff')} link={<SectionLink onClick={() => setSearchParams('ff')}/>}/>}  {...options}>
                <EventsFF />
            </Collapsible>
            <Collapsible open={isOpen('shelter')} trigger={<CollapsibleHeader title="Shelter Heroes" icon={ImageSrc.shard('any', false, [4])} link={<SectionLink onClick={() => setSearchParams('shelter')}/>}/>}  {...options}>
                <Shelter />
            </Collapsible>
            <Collapsible open={isOpen('imp')} trigger={<CollapsibleHeader title="Imp's Adventure" icon={ImageSrc.raw("layout/imp-dice")} link={<SectionLink onClick={() => setSearchParams('imp')}/>}/>}  {...options}>
                <Imp />
            </Collapsible>
            <Collapsible open={isOpen('gala')} trigger={<CollapsibleHeader title="Awakening Gala" icon={ImageSrc.resources('csg')} link={<SectionLink onClick={() => setSearchParams('gala')}/>}/>}  {...options}>
                <EventsGala />
            </Collapsible>
            <Collapsible open={isOpen('hs')} trigger={<CollapsibleHeader title="Heroic Summon" icon={ImageSrc.resources('hs')} link={<SectionLink onClick={() => setSearchParams('hs')}/>}/>}  {...options}>
                <EventsHS />
            </Collapsible>
            <Collapsible open={isOpen('po')} trigger={<CollapsibleHeader title="Prophet Summon" icon={ImageSrc.resources('po')} link={<SectionLink onClick={() => setSearchParams('po')}/>}/>}  {...options}>
                <EventsPO />
            </Collapsible>
            <Collapsible open={isOpen('wc')} trigger={<CollapsibleHeader title="Wishing Fountain" icon={ImageSrc.resources('wc')} link={<SectionLink onClick={() => setSearchParams('wc')}/>}/>}  {...options}>
                <EventsWC />
            </Collapsible>
        </div>
    );
}