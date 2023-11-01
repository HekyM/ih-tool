
import { Icon, ImageSrc } from '../../components/Images';
import { heroes, heroesByName, Hero, HeroFaction, heroFactions, heroClasses } from '../../components/heroes';
import {HeroPicker} from '../../components/HeroPicker';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faToggleOn, faToggleOff,
} from '@fortawesome/free-solid-svg-icons'
import {
    tenantsFilter,
    ci_select_hero, ci_filter_ho, ci_filter_tenant, ci_filter_faction, ci_filter_class, ci_filter_imprintable
} from './TenantsSlice';

const tenantHeroes = heroes.filter(hero => hero.tenants !== undefined || hero.tenant)
const hoHeroes = heroes.filter(hero => hero.tenants !== undefined)


export function TenantFilters() {
    const filterState = useAppSelector(tenantsFilter);
    const dispatch = useAppDispatch();

    return (
        <table className='ihContainer w-max' style={{height: '8em'}}>
            <tbody>
                <tr>
                    <td style={{width: '13em', borderRight: '2px solid', paddingRight: '.5em'}}>
                        <div className='btn-role' onClick={() => dispatch(ci_filter_ho())} >
                            <span style={{width: '10.5em', display: 'inline-block', textAlign: 'left'}}>Home Owner</span>
                            <FontAwesomeIcon className='btn-role' icon={filterState.ho ? faToggleOn : faToggleOff} style={{width: '1.5em', fontSize: 'larger'}} title='toggle filter hero is home owner'/>
                        </div>
                        <div className='btn-role' onClick={() => dispatch(ci_filter_tenant())} >
                            <span style={{width: '10.5em', display: 'inline-block', textAlign: 'left'}}>Tenant</span>
                            <FontAwesomeIcon className='btn-role' icon={filterState.tenant ? faToggleOn : faToggleOff} style={{width: '1.5em', fontSize: 'larger'}} title='toggle filter hero is tenant'/>
                        </div>
                        <div className='compact-icons-picker horizontal'>
                            {heroFactions.map((faction, i) => 
                                <Icon
                                    key={`filter-faction-${faction}`}
                                    className={filterState.faction === faction ? 'circle bg-selected' : 'circle'}
                                    size='xsm'  
                                    src={ImageSrc.faction(faction)} title={faction}
                                    onClick={() => dispatch(ci_filter_faction(filterState.faction === faction ? 'undefined' : faction))} />
                            )}
                        </div>
                        <div className='compact-icons-picker horizontal'>
                            <Icon
                                    key={`filter-imprintable`}
                                    className={filterState.imprintable ? 'circle disabled' : 'circle'}
                                    size='xsm'  
                                    src={ImageSrc.layout('stars-v4')} title='non-imprintable'
                                    onClick={() => dispatch(ci_filter_imprintable())} />
                            {heroClasses.map((heroClass, i) => 
                                <Icon
                                    key={`filter-class-${heroClass}`}
                                    className={filterState.class.includes(heroClass) ? 'circle disabled' : 'circle'}
                                    size='xsm'  
                                    src={ImageSrc.faction(heroClass)} title={heroClass}
                                    onClick={() => dispatch(ci_filter_class(heroClass))} />
                            )}
                        </div>
                    </td>
                    <td style={{verticalAlign: 'top'}}>
                        <HeroPicker className='w-max' 
                                    heroes={tenantHeroes} 
                                    factionSize='xsm'
                                    herosSize='sm'
                                    faction={HeroFaction.Transcendence}
                                    selected={filterState.heroes} 
                                    style={{height: '6em'}}
                                    onSelected={(hero) => dispatch(ci_select_hero(hero.name))}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export function TenantsRow(props: {
    hero: Hero,
}) {
    const filter = useAppSelector(tenantsFilter);

    const getClass = (hero: Hero, ho: boolean) => {
        let className = ''
        if (filter.heroes.includes(hero.name))
            className += ' checked'
        else
            className += ' unchecked'

        if (!ho && hero.faction !== 'Transcendence' && (filter.class.includes(hero.class) || (filter.imprintable && !hero.imprint)))
            className += ' disabled'

        return className
    }

    const isFiltered = (hero: Hero) => {

        if (filter.faction && hero.faction !== filter.faction) return false
        if (filter.ho && filter.tenant) {
            return filter.heroes.includes(hero.name) || filter.heroes.filter(x => hero.is_tenant(x)).length !== 0
        } else if (filter.ho) {
            return filter.heroes.includes(hero.name)
        } else if (filter.tenant) {
            return filter.heroes.filter(x => hero.is_tenant(x)).length !== 0
        }
        return true
    };

    return (
        <tr className='ihRow' hidden={!isFiltered(props.hero)}>
            <td>{props.hero.icon('hero', {className: getClass(props.hero, true)})}</td>
            {props.hero.tenants && Object.entries(props.hero.tenants).map(([slot, tenants]) => {
                return (
                <td key={props.hero.name + slot} >
                    <div className='icons-list horizontal left-line centered'>
                    {Object.values(tenants).map(name => {
                        let tenant = heroesByName[name as keyof typeof heroesByName];
                        return (tenant.icon('hero', {key: tenant.name, className: getClass(tenant, false)}))
                    })}
                    </div>
                </td>
                )
            })}
        </tr>
    );
}

export function TenantsTable() {

    return (
        <div className='ihContainer w-max'>
            <TenantFilters/>
            
            <table className='ihContainer ihTable w-max'>
                <thead>
                    <tr className='ihRow'>
                        <th>Hero</th>
                        <th style={{width: '23%'}}>Slot 1</th>
                        <th style={{width: '23%'}}>Slot 2</th>
                        <th style={{width: '23%'}}>Slot 3</th>
                        <th style={{width: '23%'}}>Slot 4</th>
                    </tr>
                </thead>
                <tbody>
                    {hoHeroes.map((hero,i) => {
                        return <TenantsRow key={i} hero={hero}/>
                    })}
                </tbody>
            </table>
        </div>
    );
}