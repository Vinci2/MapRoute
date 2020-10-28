import React from 'react'
import styles from './MainHeader.module.scss';
import { Link, } from 'react-router-dom';

const MainHeader: React.FunctionComponent = () => {
    return (
        <div className={styles['main-header__container']}>
            <div className={styles['main-header__brand-container']}>
                PawKo
            </div>
            <div className={styles['main-header__menu-container']}>
                <Link to="/"><span className={styles['main-header__link']}>HOME</span></Link>
                <Link to="/map"><span className={styles['main-header__link']}>MAP</span></Link>
            </div>
        </div>
    )
}

export default MainHeader;
