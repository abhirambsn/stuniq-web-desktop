import { useContext, useEffect, useState } from "react";
import axios from "axios";

import CreateImageModal from "../components/CreateImageModal";
import CreateContainerModal from "../components/CreateContainerModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useWebContext } from "../context/WebContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTrash, faStop, faLink } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { strToHex } from "../util";

const getUserContainers = async () => {
  const token = localStorage.getItem("token");
  try {
    const resp = await axios.get(
      "http://localhost:5001/api/v1/weblab/containers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return resp.data;
  } catch (err) {
    if (err?.response?.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }
  }
};

const ViewContainers = () => {
  const [userContainers, setUserContainers] = useState([]);
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
    requestContainerDelete,
    requestContainerStop,
    userImages,
  } = useWebContext();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }

    (async () => {
      const containers = await getUserContainers();
      setUserContainers(containers);
    })();
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

        <h1 className="text-xl font-bold mb-2">All Containers</h1>
        <div className="mt-6 flex justify-between space-x-2">
          <table className="w-full rounded-full border border-indigo-500">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-2 font-bold">#</th>
                <th className="p-2 font-bold">ID</th>
                <th className="p-2 font-bold">Name</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold">Date Created</th>
                <th className="p-2 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userContainers.map((container, i) => (
                <tr key={container.docker_id} className="w-full items-center">
                  <td className="p-2 text-center">{i+1}</td>
                  <td className="p-2 text-center">
                    {container.docker_id.slice(0, 9)}
                  </td>
                  <td className="p-2 text-center">
                    {container.container_name}
                  </td>
                  <td
                    className={`p-2 text-center ${
                      container?.state === "Running"
                        ? "text-green-600"
                        : "text-red-600"
                    } font-bold`}
                  >
                    {container?.state}
                  </td>

                  <td className="p-2 text-center">
                    {moment(container.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-2 flex space-x-3 justify-center items-center">
                    <a
                      href={`/container/${container.docker_id}`}
                      className="flex space-x-2 items-center bg-indigo-600 hover:bg-indigo-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faInfo} />
                      <span>Info</span>
                    </a>
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={`/vncview/${strToHex(container.vnc_url)}`}
                      className="flex space-x-2 items-center bg-green-600 hover:bg-green-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faLink} />
                      <span>Connect</span>
                    </a>
                    <button
                      onClick={() => requestContainerStop(container?.docker_id)}
                      className="flex space-x-2 items-center bg-red-600 hover:bg-red-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faStop} />
                      <span>Stop</span>
                    </button>
                    <button
                      onClick={() =>
                        requestContainerDelete(container?.docker_id)
                      }
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

export default ViewContainers;
