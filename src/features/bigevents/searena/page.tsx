import { ImageSrc } from '../../../components/Images';
import { ImgModal } from '../../../components/ImgGalery';


export function EventsSwordEdgeArena()  {
    const imgStyle = {
        width: '840px',
        heigth: 'auto',
        borderRadius: '15px',
    }
    return (
        <>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.events('searena', 'Sword Edge Arena Rewards')} alt='Sword Edge Arena Rewards' style={imgStyle}/>
        </div>
      </>
    );
};
