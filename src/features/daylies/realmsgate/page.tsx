import { useState } from 'react';
import { HeroFaction } from '../../../components/heroes';
import { ImagesListType } from 'react-spring-lightbox';

import { Icon, ImageSrc } from '../../../components/Images';
import { ImgGalery } from '../../../components/ImgGalery';


const puppets = [
    { 
        name: 'Cruelty',
        faction: HeroFaction.Shadow,
        tldr: ['DoT', '+Atk/debuff'],
        todo: [],
        purify: 'DoT'
    },{ 
        name: 'Plunder',
        faction: HeroFaction.Shadow,
        tldr: ['-Attack', '-Armor', '-Speed', '-Heal'],
        todo: ['cry a lot'],
        purify: 'Attribute Reduction'  
    },{ 
        name: 'Bulwark',
        faction: HeroFaction.Fortress,
        tldr: ['DR', 'weak on crit', '+Atk/round'],
        todo: [],
        purify: undefined  
    },{ 
        name: 'Atrocity',
        faction: HeroFaction.Abyss,
        tldr: ['+++Atk/round(6+)', 'Atk back line'],
        todo: ['Nuke'],
        purify: undefined  
    },{ 
        name: 'Wrath',
        faction: HeroFaction.Forest,
        tldr: ['C/CD', 'Bleed', 'Crit Mark'],
        todo: [],
        purify: 'DoT'  
    },{ 
        name: 'Despair',
        faction: HeroFaction.Dark,
        tldr: ['CC', '+Atk/round'],
        todo: [],
        purify: 'Control'  
    },{ 
        name: 'Gluttony',
        faction: HeroFaction.Dark,
        tldr: ['HP', 'AoE', '+Atk/round'],
        todo: ['Antlers', 'DR'],
        purify: undefined  
    },
];
const puppetsInfo: ImagesListType = [];
for (const puppet of puppets) {
    puppetsInfo.push({
        src: ImageSrc.events('realms-gate', puppet.name),
        loading: 'lazy',
        alt: puppet.name,
    })
};

function PuppetsCheatsheet()  {
    const [galeryIsOpen, setGaleryIsOpen] = useState(false);
    const [currentImageIndex, setCurrentIndex] = useState(0);
    return (
        <>
        <table className='ihContainer ihDataTable no-footer w-max' cellPadding="0">
            <thead>
                <tr>
                    <td style={{width: '2em'}}></td>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: '2em'}}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {puppets.map((puppet, i) => 
                <tr key={`puppet-${i}`}>
                    <td><Icon size='xsm' src={ImageSrc.faction(puppet.faction)} title={puppet.name}/></td>
                    <td style={{textAlign: 'left'}}>{puppet.name}</td>
                    <td><Icon size='xsm' src={ImageSrc.events('realms-gate/purify', puppet.purify || 'any')} title={puppet.purify + ' Purify'}/></td>
                    <td style={{textAlign: 'left'}}>{puppet.todo.join(', ')}</td>
                    <td style={{textAlign: 'left'}}>{puppet.tldr.join(', ')}</td>
                    <td><div><Icon size='tiny' src={ImageSrc.info} onClick={() => { setCurrentIndex(i); setGaleryIsOpen(!galeryIsOpen);}} /></div></td>
                </tr>
                )}
            </tbody>
        </table>
        <ImgGalery images={puppetsInfo}  showIndex={currentImageIndex} isOpen={galeryIsOpen} onClose={() => setGaleryIsOpen(false)}/>
        </>
      );
};

export function RealmsGate()  {
    return (
        <>
            <PuppetsCheatsheet />
        </>
    );
};
    
