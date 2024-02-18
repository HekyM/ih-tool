import React from 'react';

const imagesRoot = process.env.PUBLIC_URL + "/assets/images"
const imagesExt = ".webp"

export interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    size: "tiny" | "xsm" | "sm" | "md" | "lg" | "text" | "btn" | "preview" | "preview-l" | "preview-full";
}

const defaultIconProps: IconProps = {
    size: 'md',
}

export function Icon({ size, ...common }: IconProps) {
    if (common.className)
        common.className += ` icon icon-${size}`
    else
        common.className = `icon icon-${size}`

    if (common.style?.backgroundImage) 
        common.className += ' bg-img'

    if (!common.alt && common.title) 
        common.alt = `${common.title}`

    if (!common.alt)
        common.alt = ''

    if (common.alt === undefined) 
        console.log(common)

    return (
        <img {...common}/>
    );
};
Icon.defaultProps = defaultIconProps;

export class ImageSrc {
    static raw = (name: string) => 
        `${imagesRoot}/${name}${imagesExt}`
    static layout = (name: string) =>
        `${imagesRoot}/layout/${name.replaceAll(' ', '-').toLowerCase()}${imagesExt}`
    static resources = (name: string) =>
        `${imagesRoot}/resources/${name.replaceAll(' ', '-').toLowerCase()}${imagesExt}`
    static event = (name: string) =>
        `${imagesRoot}/layout/events/${name.replaceAll(' ', '-').toLowerCase()}${imagesExt}`
    static events = (event: string, name: string) =>
        `${imagesRoot}/events/${event}/${name.replaceAll(' ', '-').toLowerCase()}${imagesExt}`

    static info = 
        `${imagesRoot}/layout/i${imagesExt}`

    static hero = (name: string, level = 5) => 
        `${imagesRoot}/heroes/${name.replaceAll(' ', '-').toLowerCase()}-${level}${imagesExt}`
    static hero_rank = (rank: string): string => 
        `${imagesRoot}/heroes/rank/${rank.toLowerCase()}${imagesExt}`
    static hero_star = (rank: string): string => 
        `${imagesRoot}/heroes/star/${rank.toLowerCase()}${imagesExt}`
    static class = (name: string) => 
        `${imagesRoot}/layout/${name.toLowerCase()}${imagesExt}`
    static faction = (name: string) => 
        `${imagesRoot}/layout/${name.toLowerCase()}${imagesExt}`
    static shard = (faction: string, elite: boolean, stars: number[]) => {
        return `${imagesRoot}/heroes/shards/${ImageSrc.shardName(faction, elite, stars)}${imagesExt}`
    }
    static shardName = (faction: string, elite: boolean, stars: number[]) => {
        var _faction = 'any'
        var _type = 'normal'
        var _stars = 5

        if (['Dark', 'Light', 'Transcendence'].includes(faction)) {
            _faction = faction
        }
        if (elite) {
            _type = 'elite'
        }

        if (stars.includes(4)) {
            _stars = 4
            _faction = 'any'
        }

        return `${_faction}-${_type}-${_stars}`
    }
};
