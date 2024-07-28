import React, { useEffect, useState } from 'react';
import ThreeScene from './ThreeScene';
import { fetchNodes, NodeData } from '../data/fetchers';

const NodeDemo = () => {
  const [nodes, setNodes] = useState<NodeData[]>([{ id: 'node1', type: 'node', version: '1.0' }]);

  useEffect(() => {
    fetchNodes().then(
      (nodes: NodeData[]) => {
        console.log('nodes:', nodes);
        // change type of all to "node"
        nodes.forEach(node => node.type = "node");
        setNodes(nodes);
      }
    );
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