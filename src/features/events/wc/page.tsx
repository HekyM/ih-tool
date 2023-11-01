import { sum } from 'lodash';

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { WCcurrency, selectWCRewards } from './slice';


const accumulate = (arr: number[]) => arr.map((sum => value => sum += value)(0));


export function EventsWC() {
    const state = useAppSelector(selectWCRewards);
    const dispatch = useAppDispatch();

    const loops_count = 9;
    const loops = Array(loops_count).fill(0);
    const milestones = Object.keys(state.currency).map(points => Number(points));
    const loop_points = milestones.slice(-1).pop()!;
    const milestones_sums = [...milestones]; //accumulate(milestones);
    const currency_points = Object.values(state.currency);
    const currency_sums = accumulate(currency_points);
    const currency_loop_points = sum(currency_points);

    return (
        <>
            <table className='ihContainer'>
                <thead>
                    <tr>
                        {milestones.map((milestone, i) => 
                            <td key={i}>{milestone} points</td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {milestones.map((milestone, i) => 
                            <td key={i}>
                                <input className='ih-input number' aria-label={`${milestone} points reward`} 
                                    type="number"
                                    value={state.currency[milestone]} 
                                    onChange={(e) => dispatch(WCcurrency({points: milestone, currency: Number(e.target.value)}))}
                                />
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>
            <table className='ihContainer ihDataTable no-footer w-max'>
                <thead>
                    <tr>
                        <td>Loop</td><td>Loop Points</td><td>WC</td><td>WC (80%)</td><td>Currency</td>
                    </tr>
                </thead>
                <tbody>
                    {loops.map((_, i) => {
                        return milestones.map((milestone, j) => {
                            var wc = loop_points * i + milestones_sums[j];
                            var reward = currency_loop_points * i + currency_sums[j];
                            return (
                                <tr key={`${i}-${j}`}>
                                    <td>{i+1}</td>
                                    <td>{milestone}</td>
                                    <td>{wc}</td>
                                    <td>{wc * 0.8}</td>
                                    <td>{reward}</td>
                                </tr>
                            )
                        })
                    })}
                </tbody>
            </table>
        </>
    );
}