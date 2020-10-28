import React, { useEffect, useRef, useState } from 'react'
import { Map, Source } from './map33/example';
import {
    MapControls,
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    Scene,
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
    PCFSoftShadowMap,
    Color,
    FogExp2,
    LinearEncoding,
    AmbientLight,
    DirectionalLight,
    AxesHelper,
    LineBasicMaterial,
    BufferGeometry,
    Line
} from "three";

interface Props {
    route: number[][];
}

const MAP_ZOOM_LEVEL = 11;
const TILE_SIZE = 600;
const MAP_Z_SCALE = 0.045;
const MAPTILER_API_KEY = 'm9O0fG3i49CJlc93RV9t';

const MapPlotter: React.FunctionComponent<Props> = ({ route }) => {
    const mount = useRef<HTMLDivElement>(null);
    const [mapComponents, setMapComponents] = useState<{ renderer: any, scene: any, controls: any, camera: any }>({} as any)
    const requestRef = React.useRef<number>();
    const previousTimeRef = React.useRef<number>();

    useEffect(() => {
        if (!route || !route.length) {
            return;
        }
        const startingPoint = route[0];
        buildMap([startingPoint[1], startingPoint[0]]);
    }, [route])

    useEffect(() => {
        if (!mapComponents.renderer) { return }
        start()
    }, [mapComponents])

    useEffect(() => {
        return () => stop()
    }, [])

    useEffect(() => {
        if (!mapComponents.renderer) {
            return;
        }
        addRoute();
    }, [mapComponents])

    const buildMap = (position: number[]) => {
        const width = mount!.current!.clientWidth;
        const height = mount!.current!.clientHeight;
        const scene = new Scene();
        const camera = new PerspectiveCamera(
            75,
            width / height,
            1,
            1e6
        );
        camera.up = new Vector3(0, 0, 1);
        camera.position.set(0, 0, 700);
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: false,
        });

        renderer.outputEncoding = LinearEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.shadowMap.autoUpdate = true;
        renderer.physicallyCorrectLights = true;

        renderer.setSize(1000, 700);
        mount!.current!.appendChild(renderer.domElement);

        const controls = new MapControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.3;

        const axesHelper = new AxesHelper(2000);
        scene.add(axesHelper);

        scene.background = new Color(0x91abb5);
        scene.fog = new FogExp2(0x91abb5, 0.0000001);

        const ambientLight = new AmbientLight(0x404040, 2.5);
        const dirLight = new DirectionalLight(0xffffff, 3.5);
        dirLight.castShadow = true;
        dirLight.position.set(10000, 10000, 10000);
        scene.add(ambientLight);
        scene.add(dirLight);


        const source = new Source('maptiler', MAPTILER_API_KEY);
        new Map(scene, camera, source, position, { nTiles: 3, zoom: MAP_ZOOM_LEVEL, tileSize: TILE_SIZE, zScale: MAP_Z_SCALE   });

        setMapComponents({ renderer, camera, controls, scene });
    }

    const addRoute = () => {
        if (!route.length) {
            return;
        }

        const material = new LineBasicMaterial({ color: 0xff0000 });

        let xShift = 0;
        let yShift = 0;
        // taken from Tile numbering schemes (google maps)
        const degreeRange = 266.0511
        const numberOfTiles = Math.pow(2, MAP_ZOOM_LEVEL) -1
        const oneTileDeg = degreeRange/ numberOfTiles;
        const zPositionShift = 5;



        const points = route.map(([x, y, z], index: number) => {
            const xPoint = (x * TILE_SIZE / oneTileDeg) - xShift;
            const yPoint = (y * TILE_SIZE / oneTileDeg) - yShift;
            if (!index) {
                xShift = xPoint;
                yShift = yPoint;
                return [0, 0, z * MAP_Z_SCALE + zPositionShift]
            }
            return [xPoint, yPoint, (z * MAP_Z_SCALE + zPositionShift)]
        }).map((points: any[]) => {
            return new Vector3(points[0], points[1], points[2])
        })

        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new Line(geometry, material);
        mapComponents.scene.add(line);
    }

    const start = () => {
        if (!requestRef.current) {
            requestRef.current = requestAnimationFrame(animate);
        }
    }

    const stop = () => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef!.current);
        }
    }
    const renderScene = () => {
        mapComponents.renderer.render(mapComponents.scene, mapComponents.camera);
    }

    const animate = (time: any) => {
        if (previousTimeRef.current) {
            renderScene();
            mapComponents.controls.update();
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    return (
        <>
            <h1>MAP PLOTTER</h1>
            <div
                style={{ width: '1000px', height: '700px', margin: '0 auto 100px auto' }}
                ref={mount}
            />
        </>
    )
}

export default MapPlotter;
