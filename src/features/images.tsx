import { ImageSrc } from '../components/Images';
import { ImgModal } from '../components/ImgGalery';
import { useSearchParams } from 'react-router-dom'
import Collapsible from 'react-collapsible';
import { CollapsibleHeader } from '../components/CollapsibleHeader';
import { SectionLink } from '../components/SectionLink';

export function Images() {
    const options = { overflowWhenOpen: "visible" as const, transitionTime: 300}

    const [searchParams, setSearchParams] = useSearchParams()
    const isOpen = (name: string) => searchParams.get(name) !== null

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

            <Collapsible open={isOpen('void-imprints')} trigger={<CollapsibleHeader title="Void Imprints" icon={undefined} link={<SectionLink onClick={() => setSearchParams('void-imprints')}/>}/>} {...options}>
                <div className='ihContainer'>
                    <ImgModal src={ImageSrc.raw('others/void-imprints')} style={{...imgStyle, width: '450px',}} alt='Void Imprints'/>
                </div>
            </Collapsible>
          
            <Collapsible open={isOpen('train-lvlup')} trigger={<CollapsibleHeader title="Treasure Train Level Up" icon={undefined} link={<SectionLink onClick={() => setSearchParams('train-lvlup')}/>}/>} {...options}>
                <div className='ihContainer'>
                    <ImgModal src={ImageSrc.raw('others/train')} style={imgStyle} alt='Treasure Train Level Up'/>
                </div>
            </Collapsible>

            <Collapsible open={isOpen('monsters')} trigger={<CollapsibleHeader title="Monsters" icon={undefined} link={<SectionLink onClick={() => setSearchParams('monsters')}/>}/>} {...options}>
                <div className='ihContainer'>
                    <ImgModal src={ImageSrc.raw('others/monster/phoenix')} style={imgStyle} alt='Phoenix'/>
                    <div className='line-delimiter'/>
                    <ImgModal src={ImageSrc.raw('others/monster/apparation')} style={imgStyle} alt='Apparation'/>
                </div>
            </Collapsible>

            <Collapsible open={isOpen('arcade')} trigger={<CollapsibleHeader title="Arcade Spells" icon={undefined} link={<SectionLink onClick={() => setSearchParams('arcade')}/>}/>} {...options}>
                <div className='ihContainer'>
                    <ImgModal src={ImageSrc.raw('others/arcade')} style={imgStyle} alt='Arcade Spells'/>
                    <div className='line-delimiter'/>
                    <ImgModal src={ImageSrc.raw('others/arcade2')} style={imgStyle} alt='Arcade Spells'/>
                </div>
            </Collapsible>
        </div>
      </div>
    );
  }