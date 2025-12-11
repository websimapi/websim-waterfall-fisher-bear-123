import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReplayComposition } from "./replayComposition.jsx";
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
        lineNumber: 21,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
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
