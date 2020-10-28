import React from 'react'
import styles from './MapComments.module.scss'

const MapComments: React.FunctionComponent = () => {
    return (
        <div className={styles.comments__container}>
            <h1>Comments to the task</h1>
            <div className="">For some reason I can not make the map working when i use installed package of Map33js. 
            To make it work I copied class definitions from Map33 example in gitHub repository and simply imported it from there. 
            </div>
            <div className="">If it comes to this not perfect route ...... don't worry this cyclist has a magic bike which rides on water :)</div>
        </div>
    )
}

export default MapComments;
