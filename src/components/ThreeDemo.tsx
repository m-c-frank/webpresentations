import React, { useState } from 'react';
import ThreeScene from './ThreeScene';

const ThreeDemo = () => {
  const [cubes, setCubes] = useState([{ id: 'cube1' }, { id: 'cube2' }, { id: 'cube3' }]);

  const addCube = () => {
    const newCube = { id: `cube${cubes.length + 1}` };
    setCubes([...cubes, newCube]);
  };

  const removeCube = () => {
    setCubes(cubes.slice(0, -1));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThreeScene cubeData={cubes} />
      <div className="flex space-x-4 mt-4">
        <button onClick={addCube} className="px-4 py-2 bg-blue-500 text-white rounded">Add Cube</button>
        <button onClick={removeCube} className="px-4 py-2 bg-red-500 text-white rounded">Remove Cube</button>
      </div>
    </main>
  );
}

export default ThreeDemo;