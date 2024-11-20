import { useState, useRef, useImperativeHandle, forwardRef, Ref } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import _ from 'lodash';
import { minmax } from '../../../components/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLock, faLockOpen,
  faFloppyDisk, faArrowRotateRight,
  faArrowUp, faArrowDown,
  faChevronDown, faPlus, faXmark, faRotate,
  faForward,
} from '@fortawesome/free-solid-svg-icons'
import { Icon, ImageSrc } from '../../../components/Images';
import { BigNumber } from '../../../components/BigNumber'
import { Dropdown } from '../../../components/Dropdown';
import { heroesByName, heroRank } from '../../../components/heroes';

import { 
    regressionResources,
    addHaveHero, addBuildHero,
    updateHaveHero, updateBuildHero,
    moveHaveHero, moveBuildHero, 
    rmHaveHero, rmBuildHero, 
    enabledHaveHero, enabledBuildHero,
    setBag, resetBag, enabledBag,
    setHaveTemple, setBuildTemple,
    saveRegress, loadRegress, resetRegress,
    templeHeroRequires,
} from './slice';

import { HeroLevel, HeroCost } from './slice';


function SelectNode(props: {text: string, value: number, max: number, setValue: (value: number) => void}) {
    return (
        <Dropdown autoClose={true} display='inline-block' dropdownWidth={200}
            trigger={
                <span title={props.text} style={{width: '3em', display: 'inline-block'}}>{props.value}/{props.max}</span>
            }>
            <div style={{padding: '.5em', paddingTop: '0'}}>
                <div style={{fontSize: 'smaller', marginLeft: '.6em', marginRight: '.6em'}}>
                    {props.text} Node
                </div>
                <div className='btn btn-primary' style={{display: 'inline-block', fontSize: 'smaller', width: '40%', marginLeft: '.3em', marginRight: '.3em'}} onClick={() => props.setValue(0)}>
                    {0}
                </div>
                <div className='btn btn-primary' style={{display: 'inline-block', fontSize: 'smaller', width: '40%', marginLeft: '.3em', marginRight: '.3em'}} onClick={() => props.setValue(props.max)}>
                    {props.max}
                </div>
                {_.range(1, props.max+1, 1).map((val) => 
                    <div key={'numpad-'+val} className='btn btn-primary' 
                         style={{display: 'inline-block', padding: '0', width: '18%', fontSize: 'smaller'}} 
                         onClick={() => props.setValue(val)}>
                        {val}
                    </div>
                )}
            </div>
        </Dropdown>
    )
}

const herosList: string[] = Object.keys(heroesByName)

interface UpsertRefObject {
    selectHero: (hero: HeroLevel | null ) => void
}

const HeroUpsert = forwardRef((props: {
        onAdd: (hero: HeroLevel) => void
        onUpdate: (hero: HeroLevel) => void
        onMove: (add: number) => void
    }, 
    ref: Ref<UpsertRefObject>
) => {
    useImperativeHandle(ref, () => ({ selectHero }));

    const [updating, setUpdating] = useState(false);
    const [hero, setHero] = useState<string|undefined>();
    const [rank, setRank] = useState('E5');
    const [node0, setNode0] = useState(0);
    const [node1, setNode1] = useState(0);
    const [node2, setNode2] = useState(0);
    const [lvl, setLvl] = useState(0);

    function selectHero(hero: HeroLevel | null ) {
        setUpdating(hero !== null)
        setHero(hero?.hero)
        setRank(hero?.rank || 'E5')
        setNode0(hero?.nodes ? hero?.nodes[0] : 0)
        setNode1(hero?.nodes ? hero?.nodes[1] : 0)
        setNode2(hero?.nodes ? hero?.nodes[2] : 0)
        setLvl(hero?.lvl || 0)
    }

    const ranksV = ['E5', 'V1', 'V2', 'V3', 'V4']
    const ranksT = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5']
    const ranksD = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']

    const selectHeroType = (rank: string): string => {
        return ranksV.includes(rank) ? 'void' :
               ranksT.includes(rank) ? 'tree' :
               ranksD.includes(rank) ? 'destiny' :
               '?'
    }

    const heroType = selectHeroType(rank)

    const create = (): HeroLevel => {
        let h: HeroLevel = {
            hero: hero,
            enabled: true,
            trans: hero !== undefined && heroesByName[hero].faction === "Transcendence",
            rank: rank,
        }
        if (heroType === 'void') h.nodes = [node0, node1, node2]
        if (heroType === 'tree') h.lvl = lvl
        if (heroType === 'destiny') h.lvl = lvl
        return h
    }

    const add = () => {
        props.onAdd(create())

        setHero(undefined)
        selectRank("E5")
    }

    const update = () => {
        props.onUpdate(create())
    }

    const selectRank = (rank: string) => {
        switch(selectHeroType(rank)) {
            case 'void':
                setRank(rank); setNode0(0); setNode1(0); setNode2(0);
                break;
            case 'tree':
                setRank(rank); setLvl(_.get({'T0':1, 'T1':20, 'T2':40, 'T3':60, 'T4':80, 'T5':100}, rank));
                break;
            case 'destiny':
                setRank(rank); setLvl(1);
                break;
            default:
                return;
        }
    }


    const treeRange = (rank: string): {min: number, max: number} => {
        const _min = _.get({'T0':0, 'T1':20, 'T2':40, 'T3':60, 'T4':80, 'T5':100}, rank)
        const _max = _.get({'T0':19, 'T1':39, 'T2':59, 'T3':79, 'T4':99, 'T5':120}, rank)
        return {min: _min, max: _max}
    }

    return (
        
        <div className='ihContainer' style={{padding: '0', margin: '3px 2px', backgroundColor: '#e8ce8c'}}>
        <table className='w-max'><tbody><tr>
            <td >
                {hero && herosList.includes(hero) ? heroesByName[hero].icon('hero', {'size': 'xsm'}) : <Icon size="xsm" src={ImageSrc.hero("shards/any-puppet", 10)} />}
            </td>
            <td style={{width: '13em'}}>
                <input name="hero" list="heroes" value={hero || ''} onChange={e => setHero(e.target.value)} style={{width: '97%', marginBottom: ".4em"}}/>
                <datalist id="heroes">
                    {Object.values(heroesByName).map(hero => <option key={hero.name} value={hero.name}>{hero.short || hero.name}</option>)}
                </datalist> 
            </td>
            <td style={{width: '3em'}}>
                <Dropdown autoClose={true} display='inline-block' dropdownWidth={300}
                    trigger={
                        <span style={{width: '3em', display: 'inline-block'}}>{rank}</span>
                    }>
                    <div style={{padding: '.5em', paddingTop: '0'}}>
                        <div style={{fontSize: 'smaller', marginLeft: '.6em', marginRight: '.6em'}}>
                            Void Imprints
                        </div>
                        {ranksV.map((val) => 
                            <div key={'numpad-'+val} className='btn btn-primary' 
                                style={{display: 'inline-block', padding: '0', width: '2.5em', fontSize: 'smaller'}} 
                                onClick={() => {selectRank(val)}}>
                                {val}
                            </div>
                        )}
                        <div style={{fontSize: 'smaller', marginLeft: '.6em', marginRight: '.6em'}}>
                            Tree of Origin
                        </div>
                        {ranksT.map((val) => 
                            <div key={'numpad-'+val} className='btn btn-primary' 
                                style={{display: 'inline-block', padding: '0', width: '2.5em', fontSize: 'smaller'}} 
                                onClick={() => {selectRank(val)}}>
                                {val}
                            </div>
                        )}
                        <div style={{fontSize: 'smaller', marginLeft: '.6em', marginRight: '.6em'}}>
                            Destiny Transition
                        </div>
                        {ranksD.map((val) => 
                            <div key={'numpad-'+val} className='btn btn-primary' 
                                style={{display: 'inline-block', padding: '0', width: '2.5em', fontSize: 'smaller'}} 
                                onClick={() => {selectRank(val)}}>
                                {val}
                            </div>
                        )}
                    </div>
                </Dropdown>
            </td>
            <td style={{width: '20em'}}> 
                {heroType === 'void' && rank !== 'V4' &&
                    <>
                    <SelectNode text="HP" value={node0} max={30} setValue={setNode0}/>
                    &nbsp;-&nbsp;
                    <SelectNode text="Attack" value={node1} max={30} setValue={setNode1} />
                    &nbsp;-&nbsp;
                    <SelectNode text={rank === 'V3' ? 'Speed' : 'Attack HP'} value={node2} max={10} setValue={setNode2} />
                    </>
                }
                {heroType === 'tree' &&
                    <>
                        Level
                        <input className='ih-input in-text-input number' aria-label={`stellar`} type="number" style={{width: '3em'}} 
                            value={lvl} 
                            onChange={(e) => setLvl(Math.min(Number(e.target.value), 120))}
                        />
                    
                        <Dropdown autoClose={true} display='inline-block' dropdownWidth={300}
                            trigger={
                                <FontAwesomeIcon icon={faChevronDown} style={{width: '1em'}} className='btn-role' title='select hero level'/>
                            }>
                            <div style={{padding: '.5em', paddingTop: '.25em'}}>
                                {_.range(treeRange(rank).min, treeRange(rank).max+1, 1).map((val) => 
                                    <div key={'numpad-'+val} className='btn btn-primary' 
                                        style={{visibility: val === 0 ? 'hidden' : undefined,  display: 'inline-block', padding: '0', width: '18%', fontSize: 'smaller'}} 
                                        onClick={() => setLvl(val)}>
                                        {val}
                                    </div>
                                )}
                            </div>
                        </Dropdown>
                    </>
                }
                {heroType === 'destiny' &&
                    <>
                        Level
                        <input className='ih-input in-text-input number' aria-label={`stellar`} type="number" style={{width: '3em'}} 
                            value={lvl} 
                            onChange={(e) => setLvl(Math.min(Number(e.target.value), 100))}
                        />
                        <Dropdown autoClose={true} display='inline-block' dropdownWidth={450}
                            trigger={
                                <FontAwesomeIcon icon={faChevronDown} style={{width: '1em'}} className='btn-role' title='select hero level'/>
                            }>
                            <div style={{padding: '.5em', paddingTop: '.25em'}}>
                                {_.range(1, 100+1, 1).map((val) => 
                                    <div key={'numpad-'+val} className='btn btn-primary' 
                                        style={{display: 'inline-block', padding: '0', width: '9%', fontSize: 'smaller'}} 
                                        onClick={() => setLvl(val)}>
                                        {val}
                                    </div>
                                )}
                            </div>
                        </Dropdown>
                    </>
                }
            </td>
            <td></td>
            <td style={{width: '7em'}}>
                {!updating
                 ? <>
                    <button
                        className={'inline in-text btn btn-primary right'}
                        onClick={() => add()}
                    >
                        <FontAwesomeIcon icon={faPlus} title='Add Hero' style={{width: '2em'}} />
                    </button>
                 </>
                 : <>
                    <button
                        className={'inline in-text btn btn-primary'}
                        onClick={() => props.onMove(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowUp} title='Move Hero Up' style={{width: '1em'}} />
                    </button>
                    <button
                        className={'inline in-text btn btn-primary'}
                        onClick={() => props.onMove(1)}
                    >
                        <FontAwesomeIcon icon={faArrowDown} title='Move Hero Down' style={{width: '1em'}} />
                    </button>
                    <button
                        className={'inline in-text btn btn-primary right'}
                        onClick={() => update()}
                    >
                        <FontAwesomeIcon icon={faRotate} title='Update Hero' style={{width: '2em'}} />
                    </button>
                 </>
                }
                
            </td>
        </tr></tbody></table>
      </div>
    )
});

function ResourceHeader(props: {
    text: string,
    temple_id?: number|undefined,
    onChange?: (index: number|undefined) => void
}) {
    return (
        <>
        <tr>
            <th colSpan={5} style={{textAlign: 'left', paddingLeft: '.35em'}}>
                {props.onChange !== undefined
                ? <Dropdown autoClose={true} display='inline-block' dropdownWidth={160}
                        trigger={
                            <span>{props.temple_id === undefined ? props.text : "Temple " + (props.temple_id+1) } 
                                <FontAwesomeIcon icon={faChevronDown} style={{width: '1em'}} className='btn-role' title='select hero level'/>
                            </span>
                        }>
                        <div style={{padding: '.5em', paddingTop: '.25em'}}>
                            <div key={'numpad-'+0} className='btn btn-primary' 
                                    style={{display: 'inline-block', padding: '0', width: '95%', fontSize: 'smaller'}} 
                                    onClick={() => props.onChange!(undefined)}>
                                    {props.text}
                            </div>
                            {Object.keys(templeHeroRequires).map((val) => 
                                <div key={'numpad-'+val} className='btn btn-primary' 
                                    style={{display: 'inline-block', padding: '0', width: '95%', fontSize: 'smaller'}} 
                                    onClick={() => props.onChange!(Number(val))}>
                                    Temple {Number(val)+1}
                                </div>
                            )}
                        </div>
                    </Dropdown>
                : props.text
                }
            </th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.hero("shards/any-puppet", 9)} title={'9★ Puppet'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.hero("shards/any-puppet", 10)} title={'10★ Puppet'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.resources('stellar')} title={'Stellar Shards'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.resources('Spiritual Essence')}  title={'Spiritual Essence'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.resources('Aurora Gem')} title={'Aurora Gems'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.resources('Crystal of Transcendence')} title={'Crystals of Transcendence'}/></div></th>
            <th className='dataIconCell'><div><Icon size='xsm' src={ImageSrc.resources('spiritvein shard')} title={'Spiritvein Shards'}/></div></th>
            <th></th>
        </tr>
        </>
    )
}

function HeroRow(props: {
    index: number,
    hero: HeroLevel,
    cost: HeroCost,
    selected: boolean,
    locked: boolean,
    temple: boolean,
    onSelect: (index: number, selected: boolean) => void
    onRemove: (index: number) => void
    onEnable: (index: number, enabled: boolean) => void
}) {
    const displayRankExtra = (hero: HeroLevel): string => {
        if (hero.nodes !== undefined && hero.rank !== 'V4') {
            return hero.nodes.join('-')
        }
        if (hero.lvl !== undefined) {
            return hero.lvl.toString()
        }
        return ""
    }

    const lockedVisibility = (props.locked || props.temple) ? 'hidden' : 'visible'
    const selectedClassName = !props.locked && props.selected ? 'selected' : ''

    return (
        <tr className={props.hero.enabled ? '' : 'disabled'}>
            <td>
                {!props.temple &&
                <input
                    type="checkbox"
                    name="All"
                    checked={props.hero.enabled} 
                    onChange={() => props.onEnable(props.index, !props.hero.enabled)}
                />
                }
            </td>
            <td className='hero-picker' onClick={() => !props.locked && props.onSelect(props.index, !props.selected)}>
                {props.hero.hero 
                    ? heroesByName[props.hero.hero as keyof typeof heroesByName].rank(props.hero.rank, {size: 'xsm', className: selectedClassName}) 
                    : props.hero.trans
                    ? heroRank('puppet', ImageSrc.hero("shards/transcendence-puppet", 10), props.hero.rank, {size: 'xsm', className: selectedClassName}, 'Transcendence Hero')
                    : heroRank('puppet', ImageSrc.hero("shards/any-puppet", 10), props.hero.rank, {size: 'xsm', className: selectedClassName}, 'Hero')
                }
            </td>
            <td><Icon size="tiny" src={ImageSrc.hero_star(props.hero.rank)} title={props.hero.rank} /></td>
            <td style={{fontSize: 'smaller'}}>{displayRankExtra(props.hero)}</td>
            <td></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.food9} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.food10} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.stellar} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.esence} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.aurora} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.cot} /></td>
            <td style={{textAlign: 'right'}}><BigNumber value={props.cost.spiritvein} /></td>
            <td>
                <FontAwesomeIcon icon={faXmark} style={{width: '1em', visibility: lockedVisibility}} className='btn-role' title='Remove Hero'
                    onClick={() => props.onRemove(props.index)}
                />
            </td>
        </tr>
    )
}

function TotalRow(props: {
    cost: HeroCost,
    text: string,
    colors: boolean,
}) {
    return (
        <tr>
            <td colSpan={2}><FontAwesomeIcon icon={faForward} /><FontAwesomeIcon icon={faForward} /></td>
            <td colSpan={3} style={{textAlign: 'left'}}>&Sigma; {props.text}</td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.food9} style={{color: !props.colors ? 'inherit' : props.cost.food9 < 0 ? 'darkred' : 'darkgreen'}} /></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.food10} style={{color: !props.colors ? 'inherit' : props.cost.food10 < 0 ? 'darkred' : 'darkgreen'}} /></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.stellar} style={{color: !props.colors ? 'inherit' : props.cost.stellar < 0 ? 'darkred' : 'darkgreen'}} /></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.esence} style={{color: !props.colors ? 'inherit' : props.cost.esence < 0 ? 'darkred' : 'darkgreen'}}/></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.aurora} style={{color: !props.colors ? 'inherit' : props.cost.aurora < 0 ? 'darkred' : 'darkgreen'}}/></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.cot} style={{color: !props.colors ? 'inherit' : props.cost.cot < 0 ? 'darkred' : 'darkgreen'}}/></td>
            <td style={{textAlign: 'right'}}><BigNumber zero={true} value={props.cost.spiritvein} style={{color: !props.colors ? 'inherit' : props.cost.spiritvein < 0 ? 'darkred' : 'darkgreen'}}/></td>
            <td></td>
        </tr>
    )
}

function InputItem(props: {
    value: number,
    locked: boolean,
    onChange: (value: number) => void
    id: string
}) {
    const inputStyle = {marginLeft: '0', marginRight: '1px', width: 'calc(100% - 3px)', backgroundColor: '#ecdfbf', borderColor: 'darkgray', float: 'right' as const, paddingRight: '.1em'}
    if (props.locked) {
        return (
            <BigNumber value={props.value} />
        )
    } else {
        return (
            <input id={props.id} className='ih-input in-text-input number' aria-label={`spiritvein`} type="number" style={{...inputStyle}} 
                value={props.value || ''} 
                onChange={(e) => props.onChange(Number(e.target.value))}
            />
        )
    }
}


export function Regress() {
    const [selectedHave, setSelectedHave] = useState<number|null>(null);
    const [selectedBuild, setSelectedBuild] = useState<number|null>(null);
    const [locked, setLocked] = useState(false);

    const resources = useAppSelector(regressionResources);
    const dispatch = useAppDispatch();

    const refHave = useRef<UpsertRefObject>(null)
    const refBuild = useRef<UpsertRefObject>(null)

    const columnsCount = 13

    const dispatch_addHaveHero = (hero: HeroLevel) => dispatch(addHaveHero(hero))
    const dispatch_addBuildHero = (hero: HeroLevel) => dispatch(addBuildHero(hero))

    const dispatch_updateHaveHero = (hero: HeroLevel) => dispatch(updateHaveHero({index: selectedHave!, hero: hero}))
    const dispatch_updateBuildHero = (hero: HeroLevel) => dispatch(updateBuildHero({index: selectedBuild!, hero: hero}))

    const dispatch_moveHaveHero = (add: number) => {dispatch(moveHaveHero({index: selectedHave!, add: add})); setSelectedHave(minmax(0, selectedHave! + add, resources.have.heroes.length-1));}
    const dispatch_moveBuildHero = (add: number) => {dispatch(moveBuildHero({index: selectedBuild!, add: add})); setSelectedBuild(minmax(0, selectedBuild! + add, resources.build.heroes.length-1));}

    const dispatch_rmHaveHero = (index: number) => dispatch(rmHaveHero(index))
    const dispatch_rmBuildHero = (index: number) => dispatch(rmBuildHero(index))

    const dispatch_enabledHaveHero = (index: number, enabled: boolean) => dispatch(enabledHaveHero({index: index, enabled: enabled}))
    const dispatch_enabledBuildHero = (index: number, enabled: boolean) => dispatch(enabledBuildHero({index: index, enabled: enabled}))

    const dispatch_setHaveTemple = (id: number|undefined) => dispatch(setHaveTemple(id))
    const dispatch_setBuildTemple = (id: number|undefined) => dispatch(setBuildTemple(id))

    const _setLocked = (state: boolean) => {
        setLocked(state)
        _selectedHave(null)
        _selectedBuild(null)
    }
    const _selectedHave = (index: number|null) => {
        setSelectedHave(index)
        refHave.current?.selectHero((index !== null) ? resources.have.heroes[index].hero : null)
    }
    const _selectedBuild = (index: number|null) => {
        setSelectedBuild(index)
        refBuild.current?.selectHero((index !== null) ? resources.build.heroes[index].hero : null)
    }

    const headerClass = locked ? '' : 'multi-row with-title'

    return (
        <>
        <div className='ihContainer' style={{textAlign: 'left', fontSize: '.7em'}}>
            <button type="button" className="btn btn-primary" style={{paddingRight: '1em'}}  onClick={() => dispatch(loadRegress())} title="Load">
              <FontAwesomeIcon icon={faArrowRotateRight} style={{width: '2em'}}/> Load
            </button>
            <button type="button" className="btn btn-primary" style={{paddingRight: '1em'}}  onClick={() => dispatch(resetRegress())} title="Reset">
              <FontAwesomeIcon icon={faXmark} style={{width: '2em'}}/> Reset
            </button>
            <button type="button" className="btn btn-primary" style={{paddingRight: '1em'}}  onClick={() => dispatch(saveRegress())} title="Save">
              <FontAwesomeIcon icon={faFloppyDisk} style={{width: '2em'}}/> Save
            </button>
            <button type="button" className="btn btn-primary" onClick={() => _setLocked(!locked)} title="Lock Editing" style={{float: 'right'}}>
              <FontAwesomeIcon icon={locked ? faLock : faLockOpen} style={{width: '2em'}}/>
            </button>
        </div>
        <table id='RegressionTable' className='ihContainer ihDataTable no-footer w-max'>
            <thead>
                <tr className='spacer'>
                    <td style={{width: '1em'}}></td>
                    <td style={{width: '1.5em'}}></td>
                    <td style={{width: '1.5em'}}></td>
                    <td style={{width: '5em'}}></td>
                    <td style={{width: 'auto'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '2.5em'}}></td>
                    <td style={{width: '8em'}}></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '3em'}}></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '7em'}}></td>
                    <td style={{width: '1em'}}></td>
                </tr>
            </thead>  
            <thead className={headerClass}>
                {!locked &&
                <tr><th colSpan={columnsCount}>
                    <HeroUpsert ref={refHave} onAdd={dispatch_addHaveHero} onUpdate={dispatch_updateHaveHero} onMove={dispatch_moveHaveHero} />
                </th></tr>
                }
                <ResourceHeader text="Regress Heroes" temple_id={resources.have.temple_id} onChange={dispatch_setHaveTemple}/>
            </thead>
            <tbody>
                {(resources.have.temple_id === undefined ? resources.have.heroes : templeHeroRequires[resources.have.temple_id].heroes).map((x, i) => 
                    <HeroRow key={'have-'+i+locked} 
                        index={i} 
                        hero={x.hero} 
                        cost={x.cost}
                        selected={selectedHave === i }
                        locked={locked || resources.have.temple_id !== undefined}
                        temple={resources.have.temple_id !== undefined}
                        onRemove={dispatch_rmHaveHero} 
                        onEnable={dispatch_enabledHaveHero}
                        onSelect={(index, selected) => _selectedHave(selected ? index : null)} />
                )}
                {resources.have.temple_id === undefined &&
                <tr className={resources.have.bag.enabled ? '' : 'disabled'}>
                        <td>
                        <input
                            type="checkbox"
                            name="Use Bag"
                            checked={resources.have.bag.enabled} 
                            onChange={() => dispatch(enabledBag(!resources.have.bag.enabled))}
                        />
                    </td>
                    <td><Icon size="xsm" src={ImageSrc.layout("bag")} /></td>
                    <td colSpan={2} style={{textAlign: 'left'}}>Bag</td>
                    <td></td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'food9'} value={resources.have.bag.cost.food9} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, food9: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'food10'} value={resources.have.bag.cost.food10} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, food10: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'stellar'} value={resources.have.bag.cost.stellar} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, stellar: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'esence'} value={resources.have.bag.cost.esence} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, esence: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'aurora'} value={resources.have.bag.cost.aurora} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, aurora: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'cot'} value={resources.have.bag.cost.cot} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, cot: value} ))} />
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <InputItem id={'spiritvein'} value={resources.have.bag.cost.spiritvein} locked={locked} onChange={(value) => dispatch(setBag({...resources.have.bag.cost, spiritvein: value} ))} />
                    </td>
                    <td>
                        <FontAwesomeIcon icon={faXmark} style={{width: '1em', display: locked ? 'none' : 'initial'}} className='btn-role' title='edit hero' 
                            onClick={() => dispatch(resetBag())}
                        />
                    </td>
                </tr>
                }
                <TotalRow text='Get' cost={resources.have.temple_id === undefined ? resources.have.total : templeHeroRequires[resources.have.temple_id].total} colors={false}/>
            </tbody>

            <thead className={headerClass}>
                {!locked &&
                <tr><th colSpan={columnsCount}>
                    <HeroUpsert ref={refBuild} onAdd={dispatch_addBuildHero} onUpdate={dispatch_updateBuildHero} onMove={dispatch_moveBuildHero} />
                </th></tr>
                }
                <ResourceHeader text="Build Heroes" temple_id={resources.build.temple_id} onChange={dispatch_setBuildTemple}/>
            </thead>
            <tbody>
                {(resources.build.temple_id === undefined ? resources.build.heroes : templeHeroRequires[resources.build.temple_id].heroes).map((x, i) => 
                    <HeroRow key={'build-'+i+locked} 
                        index={i} 
                        hero={x.hero} 
                        cost={x.cost} 
                        selected={selectedBuild === i}
                        locked={locked || resources.build.temple_id !== undefined}
                        temple={resources.build.temple_id !== undefined} 
                        onRemove={dispatch_rmBuildHero} 
                        onEnable={dispatch_enabledBuildHero}
                        onSelect={(index, selected) => _selectedBuild(selected ? index : null)} />
                )}
                <TotalRow text='Use' cost={resources.build.temple_id === undefined ? resources.build.total : templeHeroRequires[resources.build.temple_id].total} colors={false}/>
            </tbody>

            <thead>
                <ResourceHeader text="Balance"/>
            </thead>
            <tbody>
                <TotalRow text='Diff' cost={resources.total} colors={true}/>
            </tbody>
        </table>
        </>
    )
}