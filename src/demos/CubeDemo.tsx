import React, { useState } from 'react';
import ThreeScene from './ThreeScene';

const CubeDemo = () => {
  const [cubes, setCubes] = useState([{ id: 'cube1', type: 'cube' }, { id: 'cube2', type: 'cube' }, { id: 'cube3', type: 'cube' }]);

  const addCube = () => {
    const newCube = { id: `cube${cubes.length + 1}`, type: 'cube' };
    setCubes([...cubes, newCube]);
  };

  const removeCube = () => {
    setCubes(cubes.slice(0, -1));
  };

  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex-1'>
        <ThreeScene cubeData={cubes} />
      </div>
      <div className='flex justify-center p-4'>
        {/* <button onClick={addCube}>
          Add Cube
        </button>
        <button onClick={removeCube}>
          Remove Cube
        </button> */}
{/*  modern ui buttonsL        */}
        <button onClick={addCube} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Cube
        </button>
        <button onClick={removeCube} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remove Cube
        </button>
      </div>
    </div>
  );
}

export default CubeDemo;