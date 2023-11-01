import { Icon, ImageSrc } from '../../../components/Images';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';

import { heroesByName } from '../../../components/heroes';
import { HeroPicker } from '../../../components/HeroPicker';
import { Dropdown } from '../../../components/Dropdown';
import { 
    selectShelterHero, 
    shelterHerosPlus, 
    shelterHerosMinus, 
    shelterReset, 
    selectShelter, 
    shelterFactions, 
    /*shelterFoodCount, 
    shelterFood */
} from './slice';


export function Shelter() {
    const shelter = useAppSelector(selectShelter);
    const dispatch = useAppDispatch();

    const yesnoall = (have: number, count: number) => {
        if (have === 4) return 'all'
        return have > count ? 'yes' : 'no'
    }

    return (
        <table id='shelter-table' className='ihContainer ihTable w-max'>
            <thead>
                <tr>
                    {shelterFactions.map((faction, i) =>
                        <td key={'td-hero-'+faction}>
                            
                            <Dropdown key={'hero-'+faction} autoClose={true}
                                trigger={
                                    <div className='icons-list horizontal'>
                                        <Icon key={'icon-'+faction} className='circle' src={ImageSrc.faction(faction)} title={faction}/>
                                        {shelter[faction].hero ?
                                            heroesByName[shelter[faction].hero!].icon()
                                        :
                                            <Icon key={'hero-'+faction} src={ImageSrc.raw('heroes/shards/undefined')} title={faction}/>
                                        }
                                    </div>
                                }>
                                <HeroPicker faction={faction} selector={false} food={false} onSelected={(hero) => { 
                                    dispatch(selectShelterHero({name: hero.name, faction: hero.faction, class: hero.class}))
                                }}/>
                            </Dropdown>
                            
                        </td>
                    )}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {shelterFactions.map((faction, i) =>
                        <td key={'food-'+faction}>
                            <div className='icons-list horizontal'>
                            {shelter[faction].food.map((food, i) =>
                                heroesByName[food].icon(4, {key: 'food-'+food,})
                            )}
                            </div>
                        </td>
                    )}
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    {shelterFactions.map((faction, i) =>
                        <td key={'td-counter-'+faction} className='shelter-counter'>
                            <div>
                                <span className={'shelter-radio ' + yesnoall(shelter[faction].have, 0)}>&nbsp;</span>
                                <span className={'shelter-radio ' + yesnoall(shelter[faction].have, 1)}>&nbsp;</span>
                                <span className={'shelter-radio ' + yesnoall(shelter[faction].have, 2)}>&nbsp;</span>
                                <span className={'shelter-radio ' + yesnoall(shelter[faction].have, 3)}>&nbsp;</span>
                            </div>
                            <div className='icons-list horizontal'>
                                <Icon key={'counter-minus-'+faction} size="btn" src={ImageSrc.layout('imp-minus')} title={`${faction} hero plus`} onClick={() => dispatch(shelterHerosMinus(faction))}/>
                                <Icon key={'counter-plus-'+faction} size="btn" src={ImageSrc.layout('imp-plus')} title={`${faction} hero minus`} onClick={() => dispatch(shelterHerosPlus(faction))}/>
                            </div>
                        </td>
                    )}
                </tr>
                <tr>
                    <td colSpan={4}>
                    <button className='btn btn-danger' style={{width: '6em'}}
                        onClick={() => dispatch(shelterReset())}
                    >Reset</button>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}

/*
<table id='shelter-all-table' className='ihContainer ihTable w-max'>
    <thead>
        <tr>
            <th className='col-img'></th>
            {shelterFactions.map((faction, i) =>
                <th key={'td-icon-'+faction}>
                    <Icon key={'icon-'+faction} className='circle' src={ImageSrc.faction(faction)} title={faction}/>
                </th>
            )}
        </tr>
    </thead>
    <tbody>
        {heroClasses.map(hero_class =>
        <tr key={'food-'+hero_class}>
            <td><Icon key={'icon-'+hero_class} className='circle' src={ImageSrc.class(hero_class)} title={hero_class}/></td>
            {shelterFactions.map((faction, i) =>
                <td key={'food-'+faction}>
                    <div className='icons-list floated'>
                    {shelterFood[faction][hero_class].map((food, i) =>
                        heroesByName[food].icon(4, {key: 'food-'+food,})
                    )}
                    </div>
                </td>
            )}
        </tr>
        )}
    </tbody>
</table>
*/