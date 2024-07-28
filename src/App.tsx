import { useState } from 'react';
import CubeDemo from './demos/CubeDemo';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  return (
    <main className="w-full h-full bg-gray-400 flex">
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} sm:translate-x-0`}
        aria-label="Sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M11 0L0 5v11l11 6 11-6V5L11 0Zm0 2.182l8.364 4.727L11 11.364 2.636 6.909 11 2.182Zm0 16.636l-8-4.5V7.364l8 4.5 8-4.5v7.454l-8 4.5Z" />
                  </svg>
                </div>
                <span className={`ml-3 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-10'}`}>Cubes</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className={"flex-1 transition-all duration-300 ml-16"}>
        <div id="overlay" className={`fixed top-0 left-0 z-30 w-full h-full bg-black duration-300 ${isSidebarOpen ? 'opacity-80' : 'opacity-0'} ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} />
        <CubeDemo />
      </div>
    </main>
  );
}

export default App;
