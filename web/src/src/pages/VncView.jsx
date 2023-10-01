import { useEffect, useRef } from "react";
import { VncScreen } from "react-vnc";
import { useParams } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { hexToStr } from "../util";

const VncView = () => {
  const ref = useRef();
  const { height, width } = useWindowDimensions();
  const {url} = useParams();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
        return;
    }
    if (!url) {
        window.location.href = "/dashboard";
        return;
    }
  }, [url]);

  return (
    <VncScreen
      background="#000000"
      url={hexToStr(url)}
      scaleViewport
      style={{
        width,
        height,
      }}
      ref={ref}
    />
  );
};

export default VncView;
