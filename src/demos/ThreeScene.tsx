import React, { useRef, useEffect } from 'react';
import Scene, { SceneObject } from '../components/Scene';
import Cube from '../components/Cube';
import Node from '../components/Node';
import Card from '../components/Card';
import Note from '../components/Note';

interface SceneData {
    id: string;
    type: string
}

const ThreeScene = ({ cubeData }: { cubeData: SceneData[] }) => {
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

        const initialCubes: SceneObject[] = cubeData.map((sceneObject) => {
            let node
            switch (sceneObject.type) {
                case 'node':
                    node = new Node(sceneObject);
                    break
                case 'cube':
                    node = new Cube(sceneObject);
                    break
                case "card":
                    node = new Card(sceneObject);
                    break
                case "note":
                    node = new Note(sceneObject);
                    break
                default:
                    node = new Cube(sceneObject);
            }
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

        const newCubeInstances: SceneObject[] = cubeData.map((sceneObject) => {
            let cube = cubeInstancesRef.current.find(c => c.id === sceneObject.id);
            if (!cube) {
                let node
                switch (sceneObject.type) {
                    case 'node':
                        node = new Node(sceneObject);
                        break
                    case 'cube':
                        node = new Cube(sceneObject);
                        break
                    case "card":
                        node = new Card(sceneObject);
                        break
                    case "note":
                        node = new Note(sceneObject);
                        break
                    default:
                        node = new Cube(sceneObject);
                }
                scene.addObject(node);
            }
            return cube;
        }) as SceneObject[];

        cubeInstancesRef.current = newCubeInstances;
    }, [cubeData]);

    // return <div ref={containerRef} style={{ width: '600px', height: '500px' }} />
    return <div ref={containerRef} className='w-full h-full' />;

};

export type { SceneData };
export default ThreeScene;