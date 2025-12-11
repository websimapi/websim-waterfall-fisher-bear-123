import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
const ReplayComposition = ({ src, user, score, qrCode }) => {
  const textStyle = {
    fontFamily: "'Fredoka One', 'Arial', sans-serif",
    color: "white",
    textShadow: "2px 2px 0px black",
    position: "absolute"
  };
  const username = user?.username || user?.name || user || "Player";
  const avatarUrl = user?.username ? `https://images.websim.com/avatar/${user.username}` : typeof user === "string" && user.startsWith("http") ? user : `https://images.websim.com/avatar/default`;
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
        lineNumber: 23,
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
          lineNumber: 43,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxDEV("span", { style: { ...textStyle, position: "relative", fontSize: "32px" }, children: username }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 54,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("span", { style: { ...textStyle, position: "relative", fontSize: "24px", opacity: 0.9 }, children: [
          "Score: ",
          score
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 55,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 53,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 42,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 33,
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
      padding: "15px",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    }, children: [
      /* @__PURE__ */ jsxDEV(
        Img,
        {
          src: qrCode,
          style: { width: "120px", height: "120px" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("span", { style: {
        fontFamily: "'Fredoka One', sans-serif",
        color: "black",
        fontSize: "18px",
        textTransform: "uppercase"
      }, children: "Scan To Play" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 86,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 72,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 61,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 21,
    columnNumber: 9
  });
};
let reactRoot = null;
function renderReplay(containerId, props) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!reactRoot) {
    reactRoot = createRoot(container);
  }
  const durationInFrames = 30 * 15;
  reactRoot.render(
    /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsxDEV(
      Player,
      {
        component: ReplayComposition,
        durationInFrames,
        fps: 30,
        compositionWidth: 540,
        compositionHeight: 960,
        inputProps: {
          ...props,
          qrCode: "qr_code.png"
          // Asset path
        },
        loop: true,
        autoPlay: true,
        controls: true,
        style: { width: "100%", height: "100%" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 116,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 9
    }, this)
  );
}
function unmountReplay() {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
}
export {
  renderReplay,
  unmountReplay
};
