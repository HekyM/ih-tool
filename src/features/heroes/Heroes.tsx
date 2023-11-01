import { ImageSrc } from '../../components/Images';
import { heroes, Hero, heroFactions, heroClasses } from '../../components/heroes';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    HeroesFilterState,
    filter_name,
    filter_faction, 
    filter_class, 
    filter_stars, 
    filter_shard, 
    filter_imprint,
    filter_ho,
    filter_tenant,
    selectHeroFilter,
} from './HeroesSlice';
import { Filter } from '../../components/Filter';

export interface HeroRowProps {
    hero: Hero;
    visible: boolean;
}

export function HeroHead() {
    const filter = useAppSelector(selectHeroFilter);
    const dispatch = useAppDispatch();

    return (
        <tr className='ihRow'>
            <th className='col-img'>
                <Filter items={{undefined: ImageSrc.raw('layout/undefined'), ...Object.fromEntries(heroFactions.map(f => [f, ImageSrc.faction(f)]))}} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_faction(i))}/>
            </th>
            <th className='text-left'> 
                <input
                    aria-label="Filter hero by name"
                    value={filter.name ?? ''}
                    onChange={(e) => dispatch(filter_name(e.target.value ?? null))}
                    placeholder='Hero'
                    style={{
                        width: '90%',
                        borderRadius: '10px',
                        fontSize: '1.5em',
                        paddingLeft: '0.5em',
                    }}
                />
            </th>
            <th className='col-img'>
                <Filter items={{undefined: ImageSrc.raw('layout/undefined'), ...Object.fromEntries(heroClasses.map(f => [f, ImageSrc.class(f)]))}} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_class(i))}/>
            </th>
            {false && <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("heroes/shards/undefined"),
                            'any-normal-4': ImageSrc.raw("heroes/shards/any-normal-4-yes"),
                            'any-normal-5': ImageSrc.raw("heroes/shards/any-normal-5-yes"),
                            'any-elite-5': ImageSrc.raw("heroes/shards/any-elite-5-yes"),
                            'Dark-normal-5': ImageSrc.raw("heroes/shards/dark-normal-5-yes"),
                            'Dark-elite-5': ImageSrc.raw("heroes/shards/dark-elite-5-yes"),
                            'Light-normal-5': ImageSrc.raw("heroes/shards/light-normal-5-yes"),
                            'Light-elite-5': ImageSrc.raw("heroes/shards/light-elite-5-yes"),
                            'Transcendence-elite-5': ImageSrc.raw("heroes/shards/transcendence-elite-5-yes"),
                         
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_shard(i))}/>
            </th>}
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-4-undefined"),
                            yes: ImageSrc.raw("layout/stars-4-yes"),
                            no: ImageSrc.raw("layout/stars-4-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_stars({stars: 4, filter: i}))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-5-undefined"),
                            yes: ImageSrc.raw("layout/stars-5-yes"),
                            no: ImageSrc.raw("layout/stars-5-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_stars({stars: 5, filter: i}))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-6-undefined"),
                            yes: ImageSrc.raw("layout/stars-6-yes"),
                            no: ImageSrc.raw("layout/stars-6-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_stars({stars: 6, filter: i}))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-9-undefined"),
                            yes: ImageSrc.raw("layout/stars-9-yes"),
                            no: ImageSrc.raw("layout/stars-9-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_stars({stars: 9, filter: i}))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-10-undefined"),
                            yes: ImageSrc.raw("layout/stars-10-yes"),
                            no: ImageSrc.raw("layout/stars-10-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_stars({stars: 10, filter: i}))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/stars-v4-undefined"),
                            yes: ImageSrc.raw("layout/stars-v4-yes"),
                            no: ImageSrc.raw("layout/stars-v4-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_imprint(i))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/tenant-undefined"),
                            yes: ImageSrc.raw("layout/tenant-yes"),
                            no: ImageSrc.raw("layout/tenant-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_tenant(i))}/>
            </th>
            <th className='col-img'>
                <Filter items={{
                            undefined: ImageSrc.raw("layout/ho-undefined"),
                            yes: ImageSrc.raw("layout/ho-yes"),
                            no: ImageSrc.raw("layout/ho-no"),
                        }} 
                        default='undefined' 
                        onSelected={(i) => dispatch(filter_ho(i))}/>
            </th>
        </tr>
    );
}

export function HeroRow(props: HeroRowProps) {
    return (
        <tr className='ihRow' hidden={!props.visible}>
            <td>{props.hero.icon('faction')}</td>
            <td className='text-left'>{props.hero.name}</td>
            <td>{props.hero.icon('class')}</td>
            {false && <td>{props.hero.icon('shard')}</td>}
            <td>{props.hero.icon(4)}</td>
            <td>{props.hero.icon(5)}</td>
            <td>{props.hero.icon(6)}</td>
            <td>{props.hero.icon(9)}</td>
            <td>{props.hero.icon(10)}</td>
            <td>{props.hero.icon('imprint')}</td>
            <td>{props.hero.icon('tenant')}</td>
            <td>{props.hero.icon('HO')}</td>
        </tr>
    );
}

export function HeroesTable() {
    const filter = useAppSelector(selectHeroFilter);

    const isFiltered = (hero: Hero, heroesFilter: HeroesFilterState = filter) => {
        if (heroesFilter.faction && hero.faction !== heroesFilter.faction) return false
        if (heroesFilter.name && !hero.name.toLowerCase().includes(heroesFilter.name.toLowerCase())) return false
        if (heroesFilter.class && hero.class !== heroesFilter.class) return false
        if (heroesFilter.stars[4] !== null && hero.stars.includes(4) !== heroesFilter.stars[4]) return false
        if (heroesFilter.stars[5] !== null && hero.stars.includes(5) !== heroesFilter.stars[5]) return false
        if (heroesFilter.stars[6] !== null && hero.stars.includes(6) !== heroesFilter.stars[6]) return false
        if (heroesFilter.stars[9] !== null && hero.stars.includes(9) !== heroesFilter.stars[9]) return false
        if (heroesFilter.stars[10] !== null && hero.stars.includes(10) !== heroesFilter.stars[10]) return false
        if (heroesFilter.imprint !== null && hero.imprint !== heroesFilter.imprint) return false
        if (heroesFilter.tenant !== null && hero.tenant !== heroesFilter.tenant) return false
        if (heroesFilter.ho !== null && (hero.tenants !== undefined) !== heroesFilter.ho) return false
        if (heroesFilter.shard !== null && hero.shard() !== heroesFilter.shard) return false
        return true
    };

    return (
        <table id='heroes-table' className='ihContainer ihTable w-max'>
            <thead>
                <HeroHead />
            </thead>
            <tbody>
                {heroes.map((hero,i) => {
                    return <HeroRow key={i} hero={hero} visible={isFiltered(hero)}/>
                })}
            </tbody>
        </table>
    );
}
