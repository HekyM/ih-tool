import { NavLink } from 'react-router-dom';
import { Icon, ImageSrc } from '../../components/Images';

export const sidebarItems = [
    {
        title: 'Home',
        path: '/',
        icon: ImageSrc.layout('clock')
    },
    {
        title: 'Heroes',
        path: '/heroes',
        icon: ImageSrc.layout('heros')
    },
    {
        title: 'Tenants',
        path: '/tenants',
        icon: ImageSrc.layout('tenants')
    },
    {
        title: 'Events',
        path: '/events',
        icon: ImageSrc.layout('events2')
    },
    {
        title: 'Level Up',
        path: '/lvl',
        icon: ImageSrc.layout('lvlup')
    },
    {
        title: 'Daylies',
        path: '/daylies',
        icon: ImageSrc.layout('daylies')
    },
    {
        title: 'Others',
        path: '/others',
        icon: ImageSrc.layout('images')
    },
]

export function Menu() {
    return (
        <div id='menu' className='ihContainer'>
            { sidebarItems.map((item,i) =>
                 <NavLink end className='menuItem' key={i} to={item.path}>
                     <Icon size='sm' src={item.icon} alt={'Go to ' + item.title} /><span className='menuText'>{item.title}</span>
                </NavLink>
            ) }
        </div>
    );
}