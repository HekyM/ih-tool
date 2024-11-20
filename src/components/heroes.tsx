import React, { ReactElement } from 'react';
import { Icon, ImageSrc } from './Images';
import { heroesData, HeroData} from '../data/heroes';

export class HeroFaction {
    static Shadow="Shadow"; 
    static Fortress="Fortress";
    static Abyss="Abyss";
    static Forest="Forest"; 
    static Dark="Dark"; 
    static Light="Light"; 
    static Transcendence="Transcendence";
};
export const heroFactions = [HeroFaction.Shadow, HeroFaction.Fortress, HeroFaction.Abyss, HeroFaction.Forest, HeroFaction.Light, HeroFaction.Dark, HeroFaction.Transcendence]

interface HeroIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    key?: string;
    size?: "tiny" | "xsm" | "sm" | "md" | "lg" | "text" | "btn" | "preview";
}

export class HeroClass {
    static Warrior="Warrior";
    static Mage="Mage";
    static Ranger="Ranger";
    static Assassin="Assassin";
    static Priest="Priest";
};
export const heroClasses = [HeroClass.Warrior, HeroClass.Mage, HeroClass.Ranger, HeroClass.Assassin, HeroClass.Priest]

export class HeroTenants {
    '1': string[];
    '2': string[];
    '3': string[];
    '4': string[];
}

export const  heroRank = (name: string, src: string, rank: string, props?: HeroIconProps, dsc?: string): ReactElement => {
    let _desc = dsc ? dsc : ''
    return (
        <div className="overlay-container" title={`${rank} ${_desc}`} >
            <Icon {...props} src={ src } alt={`${rank} star ${name}`} />
            <Icon {...props} className='img-overlay' src={ ImageSrc.hero_rank(rank) } alt={`${rank} star ${name}`} />
        </div>
    )
}

export class Hero implements HeroData  {
    readonly name: string;
    readonly faction: "Shadow" | "Fortress" | "Abyss" | "Forest" | "Dark" | "Light" | "Transcendence";
    readonly class: "Warrior" | "Mage"  | "Ranger" | "Assassin" | "Priest";
    readonly stars: number[];
    readonly elite: boolean;
    readonly imprint: boolean;
    readonly class_supplement?: "Warrior" | "Mage"  | "Ranger" | "Assassin" | "Priest";
    readonly tenants?: HeroTenants;
    readonly tenant?: boolean;
    readonly short?: string;

    constructor(name: string, data: HeroData) {
        this.name = name;
        this.faction = data.faction;
        this.class = data.class;
        this.stars = data.stars;
        this.elite = data.elite;
        this.imprint = data.imprint;
        this.class_supplement = data.class_supplement;
        this.tenants = data.tenants;
        this.tenant = data.tenant;
        this.short = data.short;
    }

    public icon(what: "hero" | number | 'class' | 'faction' | 'shard' | 'imprint' | 'tenant' | 'HO' = 'hero', props?: HeroIconProps): ReactElement {
        if (what === 'class') return this._class(props)
        if (what === 'faction') return this._faction(props)
        if (what === 'shard') return this._shard(props)
        if (what === 'imprint') return this._imprint(props)
        if (what === 'HO') return this._ho(props)
        if (what === 'tenant') return this._tenant(props)
        if (what === 'hero') return this._icon(undefined, props)
        else return this._icon(what, props)
    }

    public rank(rank: string, props?: HeroIconProps): ReactElement {
        let _desc = (this.short ? '[' + this.short + '] ' : '') + this.name + " | "+ this.faction + " | " + this.class
        return heroRank(this.name, ImageSrc.hero(this.name, 10), rank, props, _desc)
    }

    public _icon(level?: number, props?: HeroIconProps): ReactElement {
        let _desc = (this.short ? '[' + this.short + '] ' : '') + this.name + " | "+ this.faction + " | " + this.class
        if (!level) {
            return <Icon {...props} src={ ImageSrc.hero(this.name, 5) } title={_desc} alt={this.name} />
        } else if (this.stars.includes(level)) {
            return <Icon {...props} src={ ImageSrc.hero(this.name, level) } title={`${level}★ ${_desc}`} alt={`${level} star ${this.name}`} />
        } else {
            return <></>
        }
    }

    _class(props?: HeroIconProps): ReactElement {
        return <Icon {...props} size="sm" src={ ImageSrc.class(this.class) } title={ this.class } alt={`${this.name} class is ${this.class}`} />
    }

    _faction(props?: HeroIconProps): ReactElement {
        return <Icon {...props} size="sm" src={ ImageSrc.faction(this.faction) } title={ this.faction } alt={`${this.name} faction is ${this.faction}`} />
    }

    _shard(props?: HeroIconProps): ReactElement {
        return <Icon {...props} size="md" src={ ImageSrc.shard(this.faction, this.elite, this.stars) } title="Hero shard" alt="Hero shard" />
    }

    _imprint(props?: HeroIconProps): ReactElement {
        if (this.imprint)
            return <Icon {...props} size="sm" src={ ImageSrc.layout("stars-v4") } title="Imprintable" alt={`${this.name} is imprintable`} />
        else
            return <></>
    }

    _tenant(props?: HeroIconProps): ReactElement {
        if (this.tenant)
            return <Icon {...props} size="sm" src={ ImageSrc.layout('tenant') } title="Tenant" alt={`${this.name} is tenant`} />
        else
            return <></>
    }

    _ho(props?: HeroIconProps): ReactElement {
        if (this.tenants)
            return <Icon {...props} size="sm" src={ ImageSrc.layout('ho') } title="Homeowner" alt={`${this.name} is homeowner`} />
        else
            return <></>
    }

    shard(): string {
        return ImageSrc.shardName(this.faction, this.elite, this.stars)
    }

    public is_tenant(hero: string): boolean {
        if (!this.tenants) return false
        if (this.tenants[1].includes(hero)) return true
        if (this.tenants[2].includes(hero)) return true
        if (this.tenants[3].includes(hero)) return true
        if (this.tenants[4].includes(hero)) return true
        return false
    }
}

export const heroes = Object.entries(heroesData).map(([name,data],i) => {return new Hero(name, data)});

export const heroesByName: {[key: string]: Hero} = {}; 
heroes.forEach(hero => heroesByName[hero.name] = hero);
