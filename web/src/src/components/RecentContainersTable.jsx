import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStop,
  faInfo,
  faLink,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { strToHex } from "../util";

const RecentContainersTable = ({
  containers,
  requestContainerStop,
  requestContainerDelete,
}) => {
  return (
    <div className="bg-white w-full p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Containers</h2>
      <table className="w-full rounded-full border border-indigo-500">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-2 font-bold">ID</th>
            <th className="p-2 font-bold">Name</th>
            <th className="p-2 font-bold">Status</th>
            <th className="p-2 font-bold">Date Created</th>
            <th className="p-2 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.docker_id} className="w-full items-center">
              <td className="p-2 text-center">
                {container.docker_id.slice(0, 9)}
              </td>
              <td className="p-2 text-center">{container.container_name}</td>
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
              <td className="p-2 flex flex-col space-y-3 items-center">
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
                  onClick={() => requestContainerDelete(container?.docker_id)}
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

export default RecentContainersTable;
