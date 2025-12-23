import React from "react";
import { localStorageData } from "../axiosConfig";

const UnityPlayer = ({ gameName, baseUrl }) => {
  const iframeRef = React.useRef();

  const sendMessageToUnity = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(`${localStorage.getItem(localStorageData.refreshToken)}:${localStorage.getItem(localStorageData.accessToken)}`, "*");
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <iframe
        ref={iframeRef}
        title="Unity WebGL Player"
        src={`http://${baseUrl}${gameName}/index.html`}
        style={{ width: '100%', height: '42rem', border: 'none' }}
        onLoad={sendMessageToUnity}
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  );
};

export default UnityPlayer;
