import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import QRCode from "https://esm.sh/qrcode";
const ReplayComposition = ({ src, user, score }) => {
  const [qrCodeData, setQrCodeData] = React.useState(null);
  React.useEffect(() => {
    QRCode.toDataURL("https://splashybear.on.websim.com/", {
      width: 512,
      margin: 0,
      color: { dark: "#000000", light: "#ffffff" }
    }).then((url) => setQrCodeData(url)).catch((err) => console.error("QR Generation failed:", err));
  }, []);
  const textStyle = {
    fontFamily: "'Fredoka One', 'Arial', sans-serif",
    color: "white",
    textShadow: "2px 2px 0px black",
    position: "absolute"
  };
  const username = user?.username || user?.name || (typeof user === "string" ? user : "Player");
  let rawAvatarUrl;
  if (user?.avatar_url) {
    rawAvatarUrl = user.avatar_url;
  } else if (user?.username) {
    rawAvatarUrl = `https://images.websim.com/avatar/${user.username}`;
  } else if (typeof user === "string") {
    if (user.startsWith("http")) {
      rawAvatarUrl = user;
    } else {
      const cleanUser = user.toLowerCase();
      if (cleanUser === "player" || cleanUser === "you" || cleanUser === "guest") {
        rawAvatarUrl = `https://images.websim.com/avatar/default`;
      } else {
        rawAvatarUrl = `https://images.websim.com/avatar/${user}`;
      }
    }
  } else {
    rawAvatarUrl = `https://images.websim.com/avatar/default`;
  }
  const avatarUrl = `https://corsproxy.io/?${encodeURIComponent(rawAvatarUrl)}`;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#111" }, children: [
    /* @__PURE__ */ jsxDEV(
      OffthreadVideo,
      {
        src,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: {
      height: "15%",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "40px 30px 0 30px",
      // Top padding for safe area
      justifyContent: "space-between"
    }, children: /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: "20px" }, children: [
      /* @__PURE__ */ jsxDEV(
        Img,
        {
          src: avatarUrl,
          style: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "4px solid white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 77,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxDEV("span", { style: { ...textStyle, position: "relative", fontSize: "32px" }, children: username }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 88,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("span", { style: { ...textStyle, position: "relative", fontSize: "24px", opacity: 0.9 }, children: [
          "Score: ",
          score
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 89,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 76,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: {
      top: "auto",
      bottom: 0,
      height: "20%",
      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      padding: "0 40px 50px 0"
    }, children: /* @__PURE__ */ jsxDEV("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
    }, children: [
      qrCodeData && /* @__PURE__ */ jsxDEV(
        Img,
        {
          src: qrCodeData,
          style: {
            width: "140px",
            height: "140px",
            imageRendering: "pixelated"
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 116,
          columnNumber: 36
        }
      ),
      /* @__PURE__ */ jsxDEV("span", { style: {
        fontFamily: "'Fredoka One', sans-serif",
        color: "black",
        fontSize: "20px",
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: "1px"
      }, children: "Scan To Play" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 106,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 95,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 55,
    columnNumber: 9
  });
};
let reactRoot = null;
let mounted = false;
let currentReplayContainerId = null;
function renderReplay(containerId, props) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!reactRoot) {
    reactRoot = createRoot(container);
  }
  currentReplayContainerId = containerId;
  const durationInFrames = 30 * 15;
  const WrappedPlayer = () => {
    return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsxDEV(
      Player,
      {
        component: ReplayComposition,
        durationInFrames,
        fps: 30,
        compositionWidth: 540,
        compositionHeight: 960,
        inputProps: props,
        loop: true,
        autoPlay: true,
        controls: true,
        style: { width: "100%", height: "100%" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 161,
        columnNumber: 17
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 160,
      columnNumber: 13
    }, this);
  };
  reactRoot.render(/* @__PURE__ */ jsxDEV(WrappedPlayer, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 177,
    columnNumber: 22
  }, this));
  mounted = true;
}
function requestReplayDownload() {
  try {
    if (!currentReplayContainerId) return;
    const container = document.getElementById(currentReplayContainerId);
    if (!container) return;
    const downloadBtn = container.querySelector('button[aria-label*="ownload"]') || container.querySelector('button[title*="ownload"]');
    if (downloadBtn) {
      downloadBtn.click();
    } else {
      console.warn("Download button not found in Remotion Player controls.");
    }
  } catch (e) {
    console.warn("Failed to trigger replay download:", e);
  }
}
function unmountReplay() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
    mounted = false;
    currentReplayContainerId = null;
  }
}
export {
  renderReplay,
  requestReplayDownload,
  unmountReplay
};
