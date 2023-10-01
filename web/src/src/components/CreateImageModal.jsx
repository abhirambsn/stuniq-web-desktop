import { useState } from "react";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./CreateImageModal.css";
import axios from "axios";

const CreateImageModal = ({ isOpen, closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timezones = [
    "Asia/Kolkata",
    ...Intl.supportedValuesOf("timeZone", {
      type: "string",
    }),
  ];

  // Define your form validation schema using Yup
  const validationSchema = Yup.object().shape({
    baseImg: Yup.string().required("Base Image is required"),
    desktop: Yup.string().required("Desktop is required"),
    timezone: Yup.string().required("Timezone is required"),
    packages: Yup.string(),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      baseImg: "",
      desktop: "",
      timezone: "",
      packages: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle form submission here
      setIsSubmitting(true);
      await axios.post("http://localhost:5001/api/v1/weblab/image", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setIsSubmitting(false);
      closeModal();
    },
  });

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
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Create Image</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="baseImg" className="block font-medium">
              Base Image
            </label>
            <input
              type="text"
              id="baseImg"
              name="baseImg"
              value={formik.values.baseImg}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input"
            />
            {formik.touched.baseImg && formik.errors.baseImg && (
              <div className="text-red-600">{formik.errors.baseImg}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="desktop" className="block font-medium">
              Desktop
            </label>
            <select
              id="desktop"
              name="desktop"
              value={formik.values.desktop}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input-dropdown"
            >
              <option value="">Select Desktop</option>
              <option value="xfce">XFCE</option>
              <option value="kde">KDE</option>
              <option value="mate">MATE</option>
              <option value="i3">i3</option>
            </select>
            {formik.touched.desktop && formik.errors.desktop && (
              <div className="text-red-600">{formik.errors.desktop}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="timezone" className="block font-medium">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formik.values.timezone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input-dropdown"
            >
              <option value="">Select Timezone</option>
              {/* Populate this dropdown with timezone options */}
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
            {formik.touched.timezone && formik.errors.timezone && (
              <div className="text-red-600">{formik.errors.timezone}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="packages" className="block font-medium">
              Additional Packages
            </label>
            <textarea
              id="packages"
              name="packages"
              value={formik.values.packages}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Additional Packages"
              className="input"
            />
            {formik.touched.packages && formik.errors.packages && (
              <div className="text-red-600">{formik.errors.packages}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-600">{formik.errors.username}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-600">{formik.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="btn-submit bg-indigo-600 hover:bg-indigo-800 cursor-pointer"
            disabled={isSubmitting || !formik.isValid}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateImageModal;
