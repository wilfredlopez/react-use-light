import React from 'react'

export type SkeletonType = 'avatar' | 'text' | 'title' | 'thumbnail'



export interface SkeletonProps extends React.PropsWithChildren<{}>{
    type: SkeletonType
    maxWidth?:string | number
    size?: number | string
}

const SkeletonTypesCss:Record<SkeletonType, React.CSSProperties> = {
    avatar: {
        width: 100,
        height: 100,
        borderRadius: '50%',

    },
    text: {
        width: '100%',
        height: 12,

    },
    title: {
        width: '50%',
        height: 20,
        marginBottom: 15
    },
    thumbnail: {
        width: 100,
        height: 100
    }
}


const SkeletonCss: React.CSSProperties = {
    background: '#ddd',
    margin: '10px 0',
    borderRadius: 4,

}

const SkeletonElement = ({type, maxWidth, size, children}: SkeletonProps) => {
    const classes = `skeleton ${type}`
    let styles:React.CSSProperties = {...SkeletonCss, ...SkeletonTypesCss[type], maxWidth: maxWidth}

    if(size){
        styles.height = size
        if(type !== 'title' && type !== 'text'){
            styles.width = size
        }
    }


    return (

        <div className={classes} style={styles}>
           {children}
        </div>
    )
}


export default SkeletonElement