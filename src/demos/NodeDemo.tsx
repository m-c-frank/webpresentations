import React, { useEffect, useState } from 'react';
import ThreeScene from './ThreeScene';
import { fetchNodes, NodeData } from '../data/fetchers';

const NodeDemo = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);

  useEffect(() => {
    fetchNodes().then((data: NodeData[]) => setNodes(data));
  }, []);


  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex-1'>
        <ThreeScene cubeData={nodes} />
      </div>
      <div className='flex justify-center p-4'>
        some stuff can be added here
      </div>
    </div>
  );
}

export default NodeDemo;