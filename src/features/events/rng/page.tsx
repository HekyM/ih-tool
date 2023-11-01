import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { RNGprobability, RNGtries, RNGcompute, RNGtoggleShowAll, selectRNGRewards } from './slice';


export function EventsRNG() {
    const state = useAppSelector(selectRNGRewards);
    const dispatch = useAppDispatch();

    return (
        <>
            <div className='ihContainer'>
                Chance:
                <input className='ih-input in-text-input number' aria-label={`pull chance`}
                    type="number" 
                    value={state.probability} 
                    onChange={(e) => dispatch(RNGprobability(Number(e.target.value)))}
                    style={{width: '7em'}}
                />
                % 
                &nbsp;&nbsp; 
                Tries:
                <input className='ih-input in-text-input number' aria-label={`pull tries`}
                    type="number" 
                    value={state.tries} 
                    onChange={(e) => dispatch(RNGtries(Number(e.target.value)))}
                />
                &nbsp;&nbsp;
                <button
                    className='in-text-input btn btn-primary'
                    onClick={() => dispatch(RNGcompute())}
                >
                    <FontAwesomeIcon icon={faPlay} title='Calculate' style={{width: '2em'}}/>
                </button>
            </div>

            <table className='ihContainer ihDataTable xrng-table w-max'>
                <thead>
                    <tr>
                        <td>Get</td><td>Exact [%]</td><td style={{width: '50%'}}></td><td>Total [%]</td>
                    </tr>
                </thead>
                <tbody>
                    {state.table.filter(row => state.all || (row.cumulative > 0.001 && row.exact > 0.001)).map((row, i) =>
                        <tr key={`${row.count}-${state.tries}`}>
                            <td>{row.count}</td>
                            <td><span title={(row.exact*100).toString()} style={{width: '3em', textAlign: 'right', display: 'inline-block'}}>{(row.exact*100).toFixed(2)}</span></td>
                            <td style={{textAlign: 'start'}}>
                                <div style={{width: `${row.exact*100}%`, backgroundColor: '#66ccff', display: 'inline-block', margin: 0}}>&nbsp;</div>
                                <div style={{width: `${(row.cumulative-row.exact)*100}%`, backgroundColor: 'lightGray', display: 'inline-block', marginRight: 'auto'}}>&nbsp;</div>
                            </td>
                            <td><span title={(row.cumulative*100).toString()} style={{width: '2em', textAlign: 'right', display: 'inline-block'}}>{(row.cumulative*100).toFixed(0)}</span></td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    {state.computed === false &&
                    <tr>
                        <td colSpan={4}>
                            <span className='error'>Error: too big to calculate</span>
                        </td>
                    </tr>
                    }
                    <tr>
                        <td colSpan={4} style={{fontSize: 'small'}}>
                            <span>exact &gt; 0.001 and total &gt; 0.001</span>
                             
                            <label>
                                &nbsp;&nbsp;(
                                <input
                                    type="checkbox"
                                    name="All"
                                    checked={state.all} 
                                    onChange={() => dispatch(RNGtoggleShowAll())}/>
                                All)
                            </label>
                            
                        </td>
                    </tr>
                    
                </tfoot>
            </table>
        </>
    );
}