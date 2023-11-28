import { useState } from 'react';
import Lightbox, { ImagesListType } from 'react-spring-lightbox';
import useUpdatableState from '@landisdesign/use-updatable-state';
import { ImageSrc } from './Images';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faXmark} from '@fortawesome/free-solid-svg-icons';


function LightboxOverlay(props: {index: number, total: number, title: string, onClose: () => void, gotoPrevious: () => void, gotoNext: () => void}) {
    const overlayStyle = {
        backgroundColor: 'black',
        color: 'white',
        zIndex: '99',
        padding: '.3em'
    }
    const btnStyle = {
        padding: '0 .5em', 
        margin: '0 .5em',
    }
    return (
        <div style={overlayStyle}>
            {props.total !== 1 &&
            <>
            <FontAwesomeIcon className='btn-role' icon={faChevronLeft} onClick={props.gotoPrevious} style={btnStyle} />
            <span style={{...btnStyle, display: 'inline-block'}}>{props.index +1}|{props.total}</span>
            <FontAwesomeIcon className='btn-role' icon={faChevronRight} onClick={props.gotoNext} style={btnStyle} />
            </>
            }
            <span style={{...btnStyle, display: 'inline-block'}}>{props.title}</span>
            <FontAwesomeIcon className='btn-role' icon={faXmark} onClick={props.onClose} style={{...btnStyle, marginTop: '.3em', marginBottom: '.3em', float: 'right'}} />
        </div>
    );
}


export function ImgGalery(props: {images: ImagesListType,showIndex: number, isOpen: boolean, onClose: () => void} )  {
    const [currentImageIndex, setCurrentIndex] = useUpdatableState(props.showIndex);

    const gotoPrevious = () =>
        currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

    const gotoNext = () =>
        currentImageIndex + 1 < props.images.length &&
        setCurrentIndex(currentImageIndex + 1);

    return (
        <>
        <Lightbox
            isOpen={props.isOpen}
            onPrev={gotoPrevious}
            onNext={gotoNext}
            images={props.images}
            currentIndex={currentImageIndex}
            renderHeader={() => <LightboxOverlay title={props.images[currentImageIndex].alt} index={currentImageIndex} total={props.images.length} onClose={props.onClose} gotoPrevious={gotoPrevious} gotoNext={gotoNext}/>}
            onClose={props.onClose}
            //singleClickToZoom
        />
        </>
    );
};

export function ImgModal(props: React.ImgHTMLAttributes<HTMLImageElement> )  {
    const [isOpen, setIsOpen] = useState(false);
    const images: ImagesListType = [{
        src: props.src || ImageSrc.info,
        loading: 'lazy',
        alt: props.alt || '',
    }]

    return (
        <div className='ImgModal'>
            <ImgGalery 
                images={images} 
                showIndex={0}
                isOpen={isOpen} onClose={() => setIsOpen(false)}
            />
            <img alt='' {...props} onClick={() => { setIsOpen(!isOpen);}} />
        </div>
    );
};

interface ImgModalLinkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    text: string;
}

export function ImgModalLink(props: ImgModalLinkProps )  {
    const [isOpen, setIsOpen] = useState(false);
    const images: ImagesListType = [{
        src: props.src || ImageSrc.info,
        loading: 'lazy',
        alt: props.alt || '',
    }]

    return (
        <div className='ImgModal'>
            <ImgGalery 
                images={images} 
                showIndex={0}
                isOpen={isOpen} onClose={() => setIsOpen(false)}
            />
            <span className='btn-role' onClick={() => { setIsOpen(!isOpen);}}>{props.text}</span>
        </div>
    );
};
