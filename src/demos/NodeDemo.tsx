import React, { useState } from 'react';
import ThreeScene from './ThreeScene';

const NodeDemo = () => {
  const [nodes, setNodes] = useState([{ id: 'node1', type: 'node' }, { id: 'node2', type: 'node' }, { id: 'node3', type: 'node' }]);

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