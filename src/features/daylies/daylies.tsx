import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { Eggs } from './voidark/page';
import { RealmsGate } from './realmsgate/page';
import { EtherealRealm } from './etherealrealm/page';


export function Daylies(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    return (
        <div className='ihContainer'>
            <Collapsible open={isOpen('va')} trigger={<CollapsibleHeader title="Void Ark | Eggs" icon={ImageSrc.event('va')} link={<SectionLink onClick={() => setSearchParams('va')}/>}/>} {...options}>
                <Eggs />
            </Collapsible>
            <Collapsible open={isOpen('rg')} trigger={<CollapsibleHeader title="Realms Gate | Puppets" icon={ImageSrc.event('rg')} link={<SectionLink onClick={() => setSearchParams('rg')}/>}/>} {...options}>
                <RealmsGate />
            </Collapsible>
            <Collapsible open={isOpen('er')} trigger={<CollapsibleHeader title="Ethereal Realm" icon={ImageSrc.events('ethereal-realm', 'logo')} link={<SectionLink onClick={() => setSearchParams('er')}/>}/>} {...options}>
                <EtherealRealm />
            </Collapsible>
        </div>
    );
}