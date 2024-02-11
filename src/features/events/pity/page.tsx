import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { Pityprobability, Pitytries, Pitycompute, selectPityRewards } from './slice';
import { Chart } from "react-google-charts";


const pityChartConfig = {
    legend:{position:'none'},
    backgroundColor: '#ecdfbf',
    vAxis: {
        title: "Chance [%]",
        gridlineColor: 'gray',
        format: "#'%'",
    },
    hAxis: {
        title: "Tries",
        gridlineColor: 'gray',
    },
    series: {
        0: {
            lineWidth: 5,
            pointSize: 10,
        },
    },
    chartArea:{top:15,left:55,width:"90%", height:"80%"},
};

function PityChart(props: {data: number[]}) {
    const data: any[][] =  [
        ['Tries', 'Chance [%]'],
        ...props.data.map((value, index) => [(index+1).toString(), value*100])
    ]

    return (
        <div className="fixed-height-chart">
        <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            data={data}
            options={{...pityChartConfig}}
        />
        </div>  
    )
}


export function EventsPityRNG() {
    const state = useAppSelector(selectPityRewards);
    const dispatch = useAppDispatch();

    return (
        <>
            <div className='ihContainer'>
                Chance:
                <input className='ih-input in-text-input number' aria-label={`pull chance`}
                    type="number" 
                    value={state.probability} 
                    onChange={(e) => dispatch(Pityprobability(Number(e.target.value)))}
                    style={{width: '7em'}}
                />
                % 
                &nbsp;&nbsp; 
                Pity:
                <input className='ih-input in-text-input number' aria-label={`pull tries`}
                    type="number" 
                    value={state.tries} 
                    onChange={(e) => dispatch(Pitytries(Number(e.target.value)))}
                />
                &nbsp;&nbsp;
                <button
                    className='in-text-input btn btn-primary'
                    onClick={() => dispatch(Pitycompute())}
                >
                    <FontAwesomeIcon icon={faPlay} title='Calculate' style={{width: '2em'}}/>
                </button>
            </div>

            <div className='ihContainer'>
                {state.computed && <PityChart data={state.chance} />}
                
            </div>
        </>
    );
}