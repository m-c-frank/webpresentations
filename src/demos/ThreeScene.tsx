import React, { useRef, useEffect } from 'react';
import Scene, { SceneObject } from '../components/Scene';
import Cube from '../components/Cube';
import Node from '../components/Node';

interface CubeData {
    id: string;
    type: string
}

const ThreeScene = ({ cubeData }: { cubeData: CubeData[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const cubeInstancesRef = useRef<SceneObject[]>([]);

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

        const initialCubes: SceneObject[] = cubeData.map(({ id, type }) => {
            const node = type === 'node' ? new Node(id) : new Cube(id);
            scene.addObject(node);
            return node;
        });

        cubeInstancesRef.current = initialCubes;

        return () => {
            cubeInstancesRef.current.forEach(cube => {
                scene.removeObject(cube);
            });
        };
    }, []);


    useEffect(() => {
        console.log('cubeData:', cubeData);
        const scene = sceneRef.current;

        if (!scene) return;

        cubeInstancesRef.current.forEach(cube => {
            if (!cubeData.some(data => data.id === cube.id)) {
                scene.removeObject(cube);
            }
        });

        const newCubeInstances: SceneObject[]= cubeData.map(({ id, type }) => {
            let cube = cubeInstancesRef.current.find(c => c.id === id);
            if (!cube) {
                const node = type === 'node' ? new Node(id) : new Cube(id);
                scene.addObject(node);
            }
            return cube;
        }) as SceneObject[];

        cubeInstancesRef.current = newCubeInstances;
    }, [cubeData]);

    // return <div ref={containerRef} style={{ width: '600px', height: '500px' }} />
    return <div ref={containerRef} className='w-full h-full' />;

};

export default ThreeScene;