import React, { useEffect, useState } from 'react'
import styles from './Map.module.scss'
import MapComments from './MapComments/MapComments';
import MapPlotter from './MapPlotter/MapPlotter'
import { fetchBicycleRoute } from './services/MapHttpService';

const Map: React.FunctionComponent = () => {
    const [route, setRoute] = useState<[][]>([])
    useEffect(() => {
        fetchBicycleRoute().then((data) => setRoute(data))
    }, [])

    return (
        <div className={styles.chart__container}>
            <MapComments></MapComments>
            <MapPlotter route={route}></MapPlotter>
        </div>
    )
}

export default Map;
