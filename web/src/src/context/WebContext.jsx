import axios from "axios";
import React, { useState, useEffect } from "react";

const WebContext = React.createContext();
export const WebContextProvider = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
  const [isCreateContainerModalOpen, setIsCreateContainerModalOpen] =
    useState(false);

  const [userProfile, setUserProfile] = useState({});
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const openCreateImageModal = () => {
    setIsCreateImageModalOpen(true);
  };

  const closeCreateImageModal = () => {
    setIsCreateImageModalOpen(false);
  };

  const openCreateContainerModal = () => {
    setIsCreateContainerModalOpen(true);
  };

  const closeCreateContainerModal = () => {
    setIsCreateContainerModalOpen(false);
  };
  const triggerLogout = async () => {
    const resp = await axios.post(
      "http://localhost:5001/api/v1/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (resp.status === 200) {
      localStorage.removeItem("token");
      closeDropdown();
      window.location.href = "/login";
    }
  };

  const getUserImages = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await axios.get(
        "http://localhost:5001/api/v1/weblab/images",
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

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    (async () => {
      try {
        const resp = await axios.get("http://localhost:5001/api/v1/auth/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserProfile(resp.data?.user);
      } catch (err) {
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
      }
    })();

    (async () => {
      const images = await getUserImages();
      setUserImages(images);
    })();
  }, []);

  const requestContainerDelete = async (containerId) => {
    try {
      const resp = await axios.delete(
        `http://localhost:5001/api/v1/weblab/container/${containerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (resp.status === 200) {
        alert("Container Deleted"); // TODO: Replace with Toast
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const requestContainerStop = async (containerId) => {
    try {
      const resp = await axios.put(
        `http://localhost:5001/api/v1/weblab/container/${containerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (resp.status === 200) {
        alert("Container Stopped"); // TODO: Replace with Toast
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const requestImageDelete = async (imageId) => {
    try {
      const resp = await axios.delete(
        `http://localhost:5001/api/v1/weblab/image/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (resp.status === 200) {
        alert("Image Deleted"); // TODO: Replace with Toast
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getContainer = async (containerId) => {
    try {
      const resp = await axios.get(
        `http://localhost:5001/api/v1/weblab/container/${containerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return resp.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = "/login";
        return;
      } else {
        console.error(err);
        alert("Error Occured while fetching Details");
        return;
      }
    }
  };

  const getImage = async (imageId) => {
    try {
      const resp = await axios.get(
        `http://localhost:5001/api/v1/weblab/image/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return resp.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        window.location.href = "/login";
        return;
      } else {
        console.error(err);
        alert("Error Occured while fetching Details");
        return;
      }
    }
  };

  return (
    <WebContext.Provider
      value={{
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
        getContainer,
        getImage,
        getUserImages,
        userImages,
        loading,
        setLoading,
      }}
    >
      {children}
    </WebContext.Provider>
  );
};

export const useWebContext = () => React.useContext(WebContext);
