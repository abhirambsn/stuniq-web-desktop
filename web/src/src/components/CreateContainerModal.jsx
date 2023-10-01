import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";

const CreateContainerModal = ({ isOpen, closeModal, userImages }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a request to create a container
    setIsSubmitting(true);
    const resp = await axios.post(
      "http://localhost:5001/api/v1/weblab/container",
      {
        image_name: selectedImage,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(resp.data);
    setIsSubmitting(false);
    alert("Container Created");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create Image Modal"
      className="modal"
      overlayClassName="overlay"
      style={{
        content: {
          width: "60%", // Adjust the width as needed
          margin: "0 auto",
        },
      }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Create Container</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Image
            </label>
            <select
              id="image"
              name="image"
              value={selectedImage}
              onChange={handleImageChange}
              className="input-dropdown"
            >
              <option value="">Select Image</option>
              {userImages.map((image) => (
                <option key={image.docker_id} value={image.docker_id}>
                  {image.name}
                </option>
              ))}
            </select>
          </div>
          {/* Other form fields for creating a container */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary px-4 py-2 bg-gray-600 hover:bg-gray-800 transition-all duration-300 ease-in-out text-white rounded-xl mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-300 ease-in-out text-white rounded-xl mr-4"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateContainerModal;
