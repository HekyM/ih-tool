import { useAppSelector } from '../app/hooks';
import { settings } from '../features/SettingsSlice';

function bigNumber(value: number): string | number {

    // 10 Zeroes for 10 Billions
    let x = Math.abs(Number(value)) >= 1.0e+10
    ? (Math.abs(Number(value)) / 1.0e+9).toFixed(0) + "\xa0B"

    // Nine Zeroes for Billions
    : Math.abs(Number(value)) >= 1.0e+9
    ? Number((Math.abs(Number(value)) / 1.0e+9)).toFixed(2) + "\xa0B"

    // 7 Zeroes for 10 Millions 
    : Math.abs(Number(value)) >= 1.0e+7
    ? (Math.abs(Number(value)) / 1.0e+6).toFixed(0) + "\xa0M"

    // Six Zeroes for Millions 
    : Math.abs(Number(value)) >= 1.0e+6
    ? Number((Math.abs(Number(value)) / 1.0e+6)).toFixed(2) + "\xa0M"

    // 4 Zeroes for 10 Thousands
    : Math.abs(Number(value)) >= 1.0e+4
    ? (Math.abs(Number(value)) / 1.0e+3).toFixed(0) + "\xa0K"

    // Three Zeroes for Thousands
    : Math.abs(Number(value)) >= 1.0e+3
    ? Number((Math.abs(Number(value)) / 1.0e+3)).toFixed(2) + "\xa0K"

    // Plain
    :Math.abs(Number(value));

    return (value < 0) ? '-' + x : x
}

interface BigNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
    value: number;
    zero?: boolean;
    format?: string;
}


export function BigNumber({ value, zero, format, ...common }: BigNumberProps) {
    const appSettings = useAppSelector(settings);

    if (!zero && value === 0) {
        return (<span className="big-number"/>)
    }
    let numFormat = format || appSettings.numbers
    switch(numFormat) {
        case 'short':
            return (<span {...common} className="big-number" title={value.toString()}>{bigNumber(value)}</span>);
        case 'long':
            return (<span {...common} className="big-number">{Number(value).toLocaleString('cs-CZ')}</span>);
        case 'longUS':
            return (<span {...common} className="big-number">{Number(value).toLocaleString('en-US')}</span>);
        default: // plain
            return (<span {...common} className="big-number">{value}</span>)
    }
}