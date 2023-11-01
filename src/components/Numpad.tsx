import { useState } from 'react';
import ReactModal from 'react-modal';


export function ModalNumpad(props: {
    title: string,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    onChange: (value: number) => void,
}) {
    const [value, setValue] = useState('');

    const num = (val: number) => {
        return (
            <td className='btn btn-primary' onClick={() => setValue(`${value}${val}`)}>
                {val}
            </td>
        )
    }

    return (
        <ReactModal
          className='ihContainer ih-modal'
          key={'modal'}
          ariaHideApp={false}
          isOpen={props.isOpen}
          onRequestClose={() => props.setIsOpen(false)}
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          style={{
            overlay: {zIndex: 100, backgroundColor: 'rgba(70, 70, 70, 0.5)', },
            content: {width: '20em',}
          }}
          >
          <div>
                <table className='w-max'>
                    <thead>
                        <tr>
                            <th colSpan={4}><h2 style={{float: 'left', margin: '0'}}>{props.title}</h2></th>
                        </tr>
                        <tr>
                            <th colSpan={4}><div className="imp-input" style={{padding: '5px', height: '1.3em'}}>{value}</div></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>{num(7)}{num(8)}{num(9)}</tr>
                    <tr>{num(4)}{num(5)}{num(6)}</tr>
                    <tr>{num(1)}{num(2)}{num(3)}</tr>
                    <tr>{num(0)}<td></td><td className='btn btn-danger' onClick={() => setValue('')}>X</td></tr>
                    </tbody>
                </table>
                <div style={{margin: '5px', height: '1.2em'}}>
                    <button type="button" className="btn btn-secondary" style={{width: '9em'}} 
                            onClick={()=> props.setIsOpen(false)}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary" style={{width: '9em', float: 'right'}} 
                            onClick={() => {props.onChange(Number(value)); props.setIsOpen(false)}}>
                        Set
                    </button>
                </div>
            </div>
      </ReactModal>
    )
}