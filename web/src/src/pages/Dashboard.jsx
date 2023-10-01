import { useContext, useEffect, useState } from "react";
import axios from "axios";

import CreateImageModal from "../components/CreateImageModal";
import CreateContainerModal from "../components/CreateContainerModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useWebContext } from "../context/WebContext";
import PieChart from "../components/PieChart";
import RecentContainersTable from "../components/RecentContainersTable";
import RecentImagesTable from "../components/RecentImagesTable";

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

const Dashboard = () => {
  
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
    requestImageDelete,
    userImages
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

        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            <PieChart
              title="Image Statistics"
              data={[
                userProfile?.stats?.inuse_images,
                userProfile?.stats?.total_images -
                  userProfile?.stats?.inuse_images,
              ]}
              labels={["In Use", "Unused"]}
              bg_colors={["red", "green"]}
              type={"Images"}
              count={userProfile?.stats?.total_images}
            />
          </div>
          <div className="w-1/2">
            <PieChart
              title="Container Statistics"
              data={[
                userProfile?.stats?.running_containers,
                userProfile?.stats?.total_containers -
                  userProfile?.stats?.running_containers,
              ]}
              labels={["Running", "Stopped"]}
              bg_colors={["purple", "green"]}
              type={"Containers"}
              count={userProfile?.stats?.total_containers}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between space-x-2">
          <RecentImagesTable
            images={userImages
              .sort((i1, i2) => i2.modifiedAt - i1.modifiedAt)
              .slice(0, 1)}
            requestImageDelete={requestImageDelete}
          />
          <RecentContainersTable
            containers={userContainers
              .sort((i1, i2) => i2.modifiedAt - i1.modifiedAt)
              .slice(0, 1)}
            requestContainerDelete={requestContainerDelete}
            requestContainerStop={requestContainerStop}
          />
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

export default Dashboard;
