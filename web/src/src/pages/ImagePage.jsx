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

const ImagePage = () => {
  const [image, setImage] = useState([]);
  const { imageId } = useParams();

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
    getImage,
    userImages,
    requestImageDelete,
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
      const result = await getImage(imageId);
      setImage(result);
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
            <h1 className="text-xl font-bold">Image {image?.name}</h1>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 font-medium">Image ID</td>
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {image.docker_id}
                      </span>
                      <button
                        onClick={() => {
                          copyToClipboard(image.docker_id);
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
                  <td className="py-2 pr-4 font-medium">Image Name</td>
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 hover:cursor-pointer hover:underline">
                        {image.name}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Date of Creation</td>
                  <td className="py-2 pr-2">
                    {moment(image?.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 pr-4 font-medium">Author</td>
                  <td>{image.author}</td>
                </tr>
              </tbody>
            </table>

            <hr />
            <h1 className="mt-4 font-bold text-xl">Actions</h1>
            <table className="w-full mt-2 mb-3">
              <tbody>
                <tr>
                  <td className="flex items-center space-x-4">
                    <button
                      onClick={() => requestImageDelete(image?.docker_id)}
                      className="flex space-x-2 items-center bg-red-700 hover:bg-red-900 transition-all duration-100 ease-in-out text-white px-2 py-1 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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

export default ImagePage;
