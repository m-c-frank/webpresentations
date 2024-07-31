import React, { useRef, useEffect } from 'react';
import Scene, { SceneObject } from '../components/scenes/Scene';
import Cube from '../components/Cube';
import Node from '../components/Node';
import Card from '../components/Card';
import NoteCard from '../components/NoteCard';

interface SceneData {
    id: string;
    type: string
}

interface ThreeSceneProps {
    cubeData: SceneData[];
    onClickCallback?: (id: string) => void;
}

const sceneObjectFromData = (sceneData: SceneData): SceneObject => {
    switch (sceneData.type) {
        case "node":
            return new Node(sceneData);
        case "cube":
            return new Cube(sceneData);
        case "card":
            return new Card(sceneData);
        case "note":
            return new NoteCard(sceneData);
        default:
            return new Cube(sceneData);
    }
}

const ThreeScene = (threeSceneProps: ThreeSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const cubeInstancesRef = useRef<SceneObject[]>([]);
    useEffect(() => {
        if (containerRef.current) {
            sceneRef.current = new Scene(containerRef.current, threeSceneProps.onClickCallback);
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

        const initialCubes: SceneObject[] = threeSceneProps.cubeData.map((sceneObjectData: SceneData) => {
            let node = sceneObjectFromData(sceneObjectData);
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
        const scene = sceneRef.current;

        if (!scene) return;

        cubeInstancesRef.current.forEach(cube => {
            if (!cube) return;
            if (!threeSceneProps.cubeData.some((data: SceneData) => data.id === cube.id)) {
                scene.removeObject(cube);
            }
        });

        const newCubeInstances: SceneObject[] = threeSceneProps.cubeData.map((sceneObjectData: SceneData) => {
            let cube = cubeInstancesRef.current.find(c => {
                if (!c) return false;
                return c.id === sceneObjectData.id
            }
            );
            if (!cube) {
                let node = sceneObjectFromData(sceneObjectData);
                scene.addObject(node);
            }
            return cube;
        }) as SceneObject[];

        cubeInstancesRef.current = newCubeInstances;
    }, [threeSceneProps?.cubeData]);

    // return <div ref={containerRef} style={{ width: '600px', height: '500px' }} />
    return <div ref={containerRef} className='w-full h-full' />;

};

export type { SceneData };
export default ThreeScene;