import {
    PlusIcon,
    CommandLineIcon,
    ListBulletIcon,
    QueueListIcon,
    HomeIcon
  } from "@heroicons/react/20/solid"; // Import Heroicons

const Sidebar = ({openCreateImageModal, openCreateContainerModal}) => {
  return (
    <aside className="h-full w-1/5 bg-indigo-800 text-white">
        <div className="p-4">
          <span className="text-2xl font-medium text-white mb-2">
            Stuniq Web Desktop
          </span>
        </div>
        <ul className="h-screen">
        <li>
            <a href="/dashboard"
              className="w-full block p-4 hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 border-b border-gray-200"
            >
              <div className="flex">
                <HomeIcon className="w-6 h-6 mr-2" />
                <span>Home</span>
              </div>
            </a>
          </li>
          <li>
            <button
              onClick={openCreateImageModal}
              className="w-full block p-4 hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 border-b border-gray-200"
            >
              <div className="flex">
                <PlusIcon className="w-6 h-6 mr-2" />
                <span>Create Image</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={openCreateContainerModal}
              className="w-full p-4 hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 border-gray-200"
            >
              <div className="flex">
                <CommandLineIcon className="w-6 h-6 mr-2" />
                <span>Create Container</span>
              </div>
            </button>
          </li>
          <li>
            <a
              href="/images"
              className="block p-4 hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 border-t border-gray-200"
            >
              <div className="flex">
                <ListBulletIcon className="w-6 h-6 mr-2" />
                <span>View Images</span>
              </div>
            </a>
          </li>
          <li>
            <a
              href="/containers"
              className="block p-4 hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 border-t border-gray-200"
            >
              <div className="flex">
                <QueueListIcon className="w-6 h-6 mr-2" />
                <span>View Containers</span>
              </div>
            </a>
          </li>
        </ul>
      </aside>
  )
}

export default Sidebar