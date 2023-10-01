import { useEffect } from "react";

import CreateImageModal from "../components/CreateImageModal";
import CreateContainerModal from "../components/CreateContainerModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useWebContext } from "../context/WebContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUbuntu,
  faDebian,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";
import { faInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const ViewImages = () => {
  const {
    closeCreateContainerModal,
    openCreateContainerModal,
    closeCreateImageModal,
    openCreateImageModal,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen,
    isCreateImageModalOpen,
    isCreateContainerModalOpen,
    triggerLogout,
    userProfile,
    requestImageDelete,
    userImages,
  } = useWebContext();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        openCreateContainerModal={openCreateContainerModal}
        openCreateImageModal={openCreateImageModal}
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Navbar */}
        <Navbar
          toggleDropdown={toggleDropdown}
          closeDropdown={closeDropdown}
          isDropdownOpen={isDropdownOpen}
          triggerLogout={triggerLogout}
          userProfile={userProfile}
        />

        <h1 className="text-xl font-bold mb-2">All Images</h1>
        <div className="mt-6 flex justify-between space-x-2">
          <table className="w-full rounded-full border border-indigo-500">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-2 font-bold">#</th>
                <th className="p-2 font-bold">ID</th>
                <th className="p-2 font-bold">Image</th>
                <th className="p-2 font-bold">Date Created</th>
                <th className="p-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userImages.map((image, i) => (
                <tr key={image.docker_id} className="w-full">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">
                    {image.docker_id.slice(7, 16)}
                  </td>
                  <td className="p-2 flex justify-center items-center space-x-4">
                    {image.name.includes("debian") ? (
                      <FontAwesomeIcon size="lg" icon={faDebian} />
                    ) : image.name.includes("ubuntu") ? (
                      <FontAwesomeIcon size="lg" icon={faUbuntu} />
                    ) : (
                      <FontAwesomeIcon size="lg" icon={faLinux} />
                    )}
                    <span>{image.name}</span>
                  </td>
                  <td className="p-2 text-center">
                    {moment(image.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 flex space-x-3 items-center justify-center">
                    <a
                      href={`/image/${image.docker_id}`}
                      className="flex space-x-2 items-center bg-indigo-600 hover:bg-indigo-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faInfo} />
                      <span>Info</span>
                    </a>
                    <button
                      onClick={() => requestImageDelete(image?.docker_id)}
                      className="flex space-x-2 items-center bg-red-700 hover:bg-red-900 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <CreateImageModal
        isOpen={isCreateImageModalOpen}
        closeModal={closeCreateImageModal}
      />
      <CreateContainerModal
        isOpen={isCreateContainerModalOpen}
        closeModal={closeCreateContainerModal}
        userImages={userImages}
      />
    </div>
  );
};

export default ViewImages;
