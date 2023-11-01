

import Collapsible from 'react-collapsible';
import { ImageSrc } from '../../components/Images';
import { CollapsibleHeader } from '../../components/CollapsibleHeader';
import { SectionLink } from '../../components/SectionLink';
import { useSearchParams } from 'react-router-dom'

import { LevelUp } from './lvlup/page';
import { Imprints } from './imprints/page';
import { Tree } from './tree/page';
import { Destiny } from './destiny/page';


export function Leveling(props: {open?: string}) {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null
    //destiny&tree&imprints&levelup
    return (
        <div className='ihContainer'>
            <Collapsible open={isOpen('levelup')} trigger={<CollapsibleHeader title="Level Up" icon={ImageSrc.resources('spirit')} link={<SectionLink onClick={() => setSearchParams('levelup')}/>}/>} {...options}>
                <LevelUp />
            </Collapsible>
            <Collapsible open={isOpen('imprints')} trigger={<CollapsibleHeader title="Void Imprints" icon={ImageSrc.resources('stellar')} link={<SectionLink onClick={() => setSearchParams('imprints')}/>}/>} {...options}>
                <Imprints />
            </Collapsible>
            <Collapsible open={isOpen('tree')} trigger={<CollapsibleHeader title="Tree of Origin" icon={ImageSrc.resources('Spiritual Essence')} link={<SectionLink onClick={() => setSearchParams('tree')}/>}/>} {...options}>
                <Tree />
            </Collapsible>
            <Collapsible open={isOpen('destiny')} trigger={<CollapsibleHeader title="Destiny Transition" icon={ImageSrc.resources('Aurora Gem')} link={<SectionLink onClick={() => setSearchParams('destiny')}/>}/>} {...options}>
                <Destiny />
            </Collapsible>
        </div>
    );
}