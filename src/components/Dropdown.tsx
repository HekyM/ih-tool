import React, { ReactElement, useRef, useState, useLayoutEffect } from 'react';

interface Offset  {
    offsetTop: number;
    offsetLeft: number;
    offsetHeight: number;
    offsetWidth: number;
}

interface DropdownMenuProps extends React.PropsWithChildren {
    trigger: Offset;
    visible: boolean;
    width: number;
    onClick: () => void;
}

function DropdownMenu(props: DropdownMenuProps) {
    const calcPosition = (trigger: Offset, width: number) => {
        //let windowHeight = window.innerHeight;
        //let windowWidth = window.innerWidth;

        let top = trigger.offsetTop + trigger.offsetHeight
        let left = (trigger.offsetLeft + trigger.offsetWidth/2)-(width/2) - 5

        /*let left = trigger.offsetLeft
        let right = left + menu.offsetWidth
        if( right > windowWidth  ) 
            left = ((trigger.offsetLeft + trigger.offsetWidth) - menu.offsetWidth)
        else if( left > menu.offsetWidth/2) 
            left = (left + trigger.offsetWidth/2)-(menu.offsetWidth/2)*/

        return {top: top, left: left}
    };

    const pos = calcPosition(props.trigger, props.width)

    return (
        <div hidden={!props.visible} className="menu" onClick={props.onClick} style={{
            //position: 'absolute',
            //top: `${pos.top}px`,
            width: `${props.width}px`,
            left: `${pos.left}px`,
            }}>
            {props.children}
        </div>
    );
};

export interface DropdownProps extends React.PropsWithChildren {
    trigger: ReactElement;
    autoClose: boolean;
    
}
const defaultDropdownProps = {
    autoClose: false,
}

export function Dropdown(props: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [selfOffset, setSelfOffset] = useState<Offset>({offsetTop: 0, offsetLeft: 0, offsetHeight:0,offsetWidth:0});
  
    const handleToggle = () => {
      setOpen(!open);
    };

    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        function updateSize() {
            if (ref.current && selfOffset.offsetWidth !== ref.current.offsetWidth) {
                setSelfOffset({
                    offsetTop: ref.current.offsetTop,
                    offsetLeft: ref.current.offsetLeft,
                    offsetHeight: ref.current.offsetHeight,
                    offsetWidth: ref.current.offsetWidth,
                })
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
      }, [ref, selfOffset]);

    return (
      <div className="dropdown">
        <div className='trigger' ref={ref}>
            {React.cloneElement(props.trigger, {
            onClick: handleToggle,
            })}
        </div>
            {open && selfOffset ? (
            <>
            <div hidden={!open} className='page-overlay' onClick={() => handleToggle()}></div>
            <DropdownMenu visible={open} trigger={selfOffset} width={selfOffset?.offsetWidth + 10 || 0} onClick={() => props.autoClose && handleToggle()}>
                {props.children}
            </DropdownMenu>
            </>
            ): null }
        {false &&
        <div className="menu" onClick={() => props.autoClose && handleToggle()}>
            {props.children}
        </div> 
        }
      </div>
    );
};
Dropdown.defaultProps = defaultDropdownProps;