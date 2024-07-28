import React, { useRef, useEffect } from 'react';
import Scene from '../components/Scene';
import Cube from '../components/Cube';

interface CubeData {
    id: string;
}

const ThreeScene = ({ cubeData }: { cubeData: CubeData[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const cubeInstancesRef = useRef<Cube[]>([]);

    useEffect(() => {
        if (containerRef.current) {
            sceneRef.current = new Scene(containerRef.current);
            sceneRef.current.render();
        }

        return () => {
            if (sceneRef.current && containerRef.current) {
                containerRef.current.removeChild(sceneRef.current.renderer.domElement);
            }
        };
    }, []);

useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const initialCubes = cubeData.map(({ id }) => {
        const cube = new Cube(id);
        scene.addObject(cube);
        return cube;
    });

    cubeInstancesRef.current = initialCubes;

    return () => {
        cubeInstancesRef.current.forEach(cube => {
            scene.removeObject(cube);
        });
    };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;

        if (!scene) return;

        cubeInstancesRef.current.forEach(cube => {
            if (!cubeData.some(data => data.id === cube.id)) {
                scene.removeObject(cube);
            }
        });

        const newCubeInstances = cubeData.map(({ id }) => {
            let cube = cubeInstancesRef.current.find(c => c.id === id);
            if (!cube) {
                cube = new Cube(id);
                scene.addObject(cube);
            }
            return cube;
        });

        cubeInstancesRef.current = newCubeInstances;
    }, [cubeData]);

    // return <div ref={containerRef} style={{ width: '600px', height: '500px' }} />
    return <div ref={containerRef} className='w-full h-full' />;

};

export default ThreeScene;
