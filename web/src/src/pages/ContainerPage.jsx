import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import CreateImageModal from "../components/CreateImageModal";
import CreateContainerModal from "../components/CreateContainerModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useWebContext } from "../context/WebContext";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faStop,
  faTrash,
  faTerminal,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard, strToHex } from "../util";
import Loading from "../components/Loading";

const ContainerPage = () => {
  const [container, setContainer] = useState([]);
  const { containerId } = useParams();

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
    getContainer,
    userImages,
    loading,
    setLoading,
  } = useWebContext();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }

    (async () => {
      setLoading(true);
      const result = await getContainer(containerId);
      setContainer(result);
      console.log(result);
      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Loading />
  ) : (
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

        <div className="flex justify-between space-x-4">
          <div className="w-full bg-white rounded-xl p-4">
            <h1 className="text-xl font-bold">
              Container {container?.container_name}
            </h1>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 font-medium">Container ID</td>
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container.docker_id?.slice(0, 10)}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.docker_id);
                          alert("Copied ID");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">
                    Container / Host Name
                  </td>
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container.container_name}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.container_name);
                          alert("Copied Hostname");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Date of Creation</td>
                  <td className="py-2 pr-2">
                    {moment(container?.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 pr-4 font-medium">Author</td>
                  <td>{container.author}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Image</td>
                  <td className="py-2 pr-2">{container?.image_name}</td>
                  <td className="py-2 pr-4 font-medium">Image Author</td>
                  <td className="py-2 pr-2">{container?.image_author}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Subdomain</td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container?.subdomain}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.subdomain);
                          alert("Copied Subdomain");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">VNC Url</td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container?.vnc_url}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.vnc_url);
                          alert("Copied Subdomain");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">SSH Port</td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container?.ssh_port}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.ssh_port);
                          alert("Copied SSH Port");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">VNC Port</td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container?.vnc_port}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.vnc_port);
                          alert("Copied VNC Port");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 pr-4 font-medium">
                    WebSocket Port (for Web VNC Clients)
                  </td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {container?.ws_port}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(container.ws_port);
                          alert("Copied WebSocket Port");
                        }}
                      >
                        <FontAwesomeIcon
                          className="text-indigo-700"
                          icon={faCopy}
                          size="sm"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-bold">State</td>
                  <td
                    className={`py-2 pr-2 font-bold ${
                      container?.state === "Running"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {container?.state}
                  </td>
                </tr>
              </tbody>
            </table>

            <hr />
            <h1 className="mt-4 font-bold text-xl">Actions</h1>
            <table className="w-full mt-2 mb-3">
              <tbody>
                <tr>
                  <td className="flex items-center space-x-4">
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={`/vncview/${strToHex(container?.vnc_url)}`}
                      className="flex space-x-2 items-center bg-green-600 hover:bg-green-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                      <span>Connect via Web</span>
                    </a>
                    <button
                      onClick={() => {
                        const text = `ssh -p ${container?.ssh_port} root@${container?.subdomain}`;
                        copyToClipboard(text);
                        alert(`Use command \"${text}\"`);
                      }}
                      className="flex space-x-2 items-center bg-blue-600 hover:bg-blue-800 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faTerminal} />
                      <span>Connect via SSH</span>
                    </button>
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
              </tbody>
            </table>
            <hr />
            <h1 className="my-3 text-xl font-bold">Logs</h1>
            <textarea
              name="logs"
              id="logs"
              disabled
              className="w-full px-3 py-1 font-serif h-64 bg-gray-200 rounded-lg text-black"
            >
              {container?.logs}
            </textarea>
          </div>
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

export default ContainerPage;
