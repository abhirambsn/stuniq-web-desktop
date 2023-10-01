import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faInfo, faLink, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  faDebian,
  faUbuntu,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";
import moment from "moment";

const RecentImagesTable = ({ images, requestImageDelete }) => {
  return (
    <div className="bg-white p-4 w-full rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Images</h2>
      <table className="w-full rounded-full border border-indigo-500">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="p-2 font-bold">ID</th>
            <th className="p-2 font-bold">Image</th>
            <th className="p-2 font-bold">Date Created</th>
            <th className="p-2 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, i) => (
            <tr
              key={image.docker_id}
              className="w-full"
            >
              <td className="p-2 text-center">
                {image.docker_id.slice(7, 16)}
              </td>
              <td className="p-2 mx-auto space-x-4">
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
              <td className="p-2 flex flex-col space-y-3 items-center">
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
  );
};

export default RecentImagesTable;
