

import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { LevelUp } from './lvlup/page';
import { Imprints } from './imprints/page';
import { Tree } from './tree/page';
import { Destiny } from './destiny/page';
import { StarSouls } from './souls/page';
import { Regress } from './regress/page';


export function Leveling(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    //destiny&tree&imprints&levelup
    return (
        <div className='ihContainer'>
            <Collapsible open={isOpen('regress')} trigger={<CollapsibleHeader title="Regress & Rebuild" icon={ImageSrc.layout('heros')} link={<SectionLink onClick={() => setSearchParams('regress')}/>}/>} {...options}>
                <Regress />
            </Collapsible>
            <Collapsible open={isOpen('levelup')} trigger={<CollapsibleHeader title="Level Up" icon={ImageSrc.resources('spirit')} link={<SectionLink onClick={() => setSearchParams('levelup')}/>}/>} {...options}>
                <LevelUp />
            </Collapsible>
            <Collapsible open={isOpen('imprints')} trigger={<CollapsibleHeader title="Void Imprints" icon={ImageSrc.layout('lvl-imprints')} link={<SectionLink onClick={() => setSearchParams('imprints')}/>}/>} {...options}>
                <Imprints />
            </Collapsible>
            <Collapsible open={isOpen('tree')} trigger={<CollapsibleHeader title="Tree of Origin" icon={ImageSrc.layout('lvl-tree')} link={<SectionLink onClick={() => setSearchParams('tree')}/>}/>} {...options}>
                <Tree />
            </Collapsible>
            <Collapsible open={isOpen('destiny')} trigger={<CollapsibleHeader title="Destiny Transition" icon={ImageSrc.layout('lvl-destiny')} link={<SectionLink onClick={() => setSearchParams('destiny')}/>}/>} {...options}>
                <Destiny />
            </Collapsible>
            <Collapsible open={isOpen('souls')} trigger={<CollapsibleHeader title="Star Souls" icon={ImageSrc.layout('lvl-souls')} link={<SectionLink onClick={() => setSearchParams('souls')}/>}/>} {...options}>
                <StarSouls />
            </Collapsible>
        </div>
    );
}