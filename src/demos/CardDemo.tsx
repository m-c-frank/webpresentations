import ThreeScene from './ThreeScene';

const cards = [
  { id: 'card1', type: 'card' },
];

const CardDemo = () => {
  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex-1'>
        <ThreeScene cubeData={cards} />
      </div>
      <div className='flex justify-center p-4'>
        some stuff can be added here
      </div>
    </div>
  );
}

export default CardDemo;