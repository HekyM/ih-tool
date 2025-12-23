import { ImageSrc } from '../components/Images';
import { ImgModal } from '../components/ImgGalery';

export function Images() {
    const sectionStyle = {
        paddingLeft: '1em',
        cursor: 'default',
    }
    const imgStyle = {
        width: '850px',
        heigth: 'auto',
        borderRadius: '10px',
    }
    return (
      <div>
        <div className='ihContainer'>
          
        <div className='collapsibleTrigger' style={sectionStyle}>Void Imprints</div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.raw('others/void-imprints')} style={{...imgStyle, width: '450px',}} alt='Void Imprints'/>
        </div>
        <div className='collapsibleTrigger' style={sectionStyle}>Treasure Train Level Up</div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.raw('others/train')} style={imgStyle} alt='Treasure Train Level Up'/>
        </div>
        <div className='collapsibleTrigger' style={sectionStyle}>Arcade Spells</div>
        <div className='ihContainer'>
            <ImgModal src={ImageSrc.raw('others/arcade')} style={imgStyle} alt='Arcade Spells'/>
            <br/>
            <ImgModal src={ImageSrc.raw('others/arcade2')} style={imgStyle} alt='Arcade Spells'/>
        </div>
        </div>
      </div>
    );
  }