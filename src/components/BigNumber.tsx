
function bigNumber(value: number): string | number {

    // 10 Zeroes for 10 Billions
    return Math.abs(Number(value)) >= 1.0e+10
    ? (Math.abs(Number(value)) / 1.0e+9).toFixed(0) + "\xa0B"

    // Nine Zeroes for Billions
    : Math.abs(Number(value)) >= 1.0e+9
    ? Number((Math.abs(Number(value)) / 1.0e+9).toFixed(2)) + "\xa0B"

    // 7 Zeroes for 10 Millions 
    : Math.abs(Number(value)) >= 1.0e+7
    ? (Math.abs(Number(value)) / 1.0e+6).toFixed(0) + "\xa0M"

    // Six Zeroes for Millions 
    : Math.abs(Number(value)) >= 1.0e+6
    ? Number((Math.abs(Number(value)) / 1.0e+6).toFixed(2)) + "\xa0M"

    // 4 Zeroes for 10 Thousands
    : Math.abs(Number(value)) >= 1.0e+4
    ? (Math.abs(Number(value)) / 1.0e+3).toFixed(0) + "\xa0K"

    // Three Zeroes for Thousands
    : Math.abs(Number(value)) >= 1.0e+3
    ? Number((Math.abs(Number(value)) / 1.0e+3).toFixed(2)) + "\xa0K"

    // Plain
    :Math.abs(Number(value));
}

interface BigNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
    value: number;
    mode: 'long'|'short';
}


export function BigNumber({ value, mode, ...common }: BigNumberProps) {
    if (value === 0) {
        return (<span/>)
    }
    return (
        mode === 'short' 
        ? <span {...common} className="big-number" title={value.toString()}>{bigNumber(value)}</span>
        : <span {...common} className="big-number">{Number(value).toLocaleString('cs-CZ')}</span>
    )
}