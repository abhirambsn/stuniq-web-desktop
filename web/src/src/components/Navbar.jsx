import { Transition } from "@headlessui/react";

const Navbar = ({
  toggleDropdown,
  closeDropdown,
  isDropdownOpen,
  triggerLogout,
  userProfile,
}) => {
  return (
    <nav className="flex justify-between items-center mb-4">
      <div></div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          onBlur={closeDropdown}
          className="flex items-center space-x-2 cursor-pointer focus:outline-none"
        >
          <span className="text-gray-600">
            Welcome, <strong>{userProfile?.name}</strong>
          </span>
          {/* User Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <Transition
          show={isDropdownOpen}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterhref="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leavehref="opacity-0"
        >
          {(ref) => (
            <div
              ref={ref}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg"
            >
              <ul>
                <li>
                  <a
                    href="/edit-profile"
                    onClick={closeDropdown}
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={triggerLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  >
                    <span className="text-red-600">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </Transition>
      </div>
    </nav>
  );
};

export default Navbar;
