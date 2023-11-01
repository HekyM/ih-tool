import React, { useState } from 'react';

import { Icon, ImageSrc } from './Images';
import { heroes, Hero, HeroFaction, heroFactions } from './heroes';

const filterFood = (hero: Hero, enabled: boolean = true) => {
    if (enabled) return true
    if (hero.stars.includes(10)) return true
    return false
}

const makeHesoesByFaction = (heroes: Hero[], food: boolean = true) => {
    let hesoesByFaction = {
        Shadow: heroes.filter(hero => hero.faction === HeroFaction.Shadow && filterFood(hero, food)),
        Fortress: heroes.filter(hero => hero.faction === HeroFaction.Fortress && filterFood(hero, food)),
        Abyss: heroes.filter(hero => hero.faction === HeroFaction.Abyss && filterFood(hero, food)),
        Forest: heroes.filter(hero => hero.faction === HeroFaction.Forest && filterFood(hero, food)),
        Dark: heroes.filter(hero => hero.faction === HeroFaction.Dark && filterFood(hero, food)),
        Light: heroes.filter(hero => hero.faction === HeroFaction.Light && filterFood(hero, food)),
        Transcendence: heroes.filter(hero => hero.faction === HeroFaction.Transcendence),
    }
    return hesoesByFaction;
}
const hesoesByFaction = makeHesoesByFaction(heroes);
const hesoesByFactionNoFood = makeHesoesByFaction(heroes, false);


export interface HeroPickerProps extends React.ImgHTMLAttributes<HTMLDivElement> {
    faction?: string;
    selector: boolean;
    heroes?: Hero[];
    selected?: string[];
    food: boolean;
    factionSize: "tiny" | "xsm" | "sm" | "md" | "lg" | "text" | "btn";
    herosSize: "tiny" | "xsm" | "sm" | "md" | "lg" | "text" | "btn";
    onSelected?: (hero: Hero) => void;
}
const defaultHeroPickerProps: HeroPickerProps = {
    selector: true,
    food: false,
    factionSize: 'md',
    herosSize: 'md',
}

export function HeroPicker({ faction, selector, heroes, selected, food, factionSize, herosSize, onSelected, ...common }: HeroPickerProps) {

    const [selected_faction, set_selected_faction] = useState<string|undefined>(faction ?? HeroFaction.Shadow);

    const forHesoesByFaction = heroes ? makeHesoesByFaction(heroes, food) : food ? hesoesByFaction : hesoesByFactionNoFood;

    const callSelected = (hero: Hero) => {
        if (onSelected && hero) onSelected(hero);
    };
 
    return (
        <div {...common}>
            {selector &&
                <div className='icons-picker horizontal'>
                    {heroFactions.map((faction, i) => 
                        <Icon
                            key={`${faction}-${i}`}
                            size={factionSize}
                            className={selected_faction === faction ? 'circle selected' : 'circle'}  
                            src={ImageSrc.faction(faction)} title={faction}
                            onClick={() => set_selected_faction(faction)} />
                    )}
                </div>
            }
            
            <div className='icons-picker floated'>
                {forHesoesByFaction[selected_faction as keyof typeof forHesoesByFaction].map(hero => 
                    hero.icon('hero', { 
                        key: hero.name,
                        size: herosSize,
                        className: selected?.includes(hero.name) ? 'selected' : '',
                        onClick: () => callSelected(hero)
                    })
                )}
            </div>

        </div>
    );
}
HeroPicker.defaultProps = defaultHeroPickerProps;