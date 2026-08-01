// ============================================================
// APP LOGO — Apana Store (customer)
//
// The app's own brand mark: rounded app-tile frame (orange #f89047)
// with a blue #4683bb location-pin + storefront glyph. Square 115×115.
// Brand colors are baked into the SVG on purpose — this is identity,
// not a themeable surface, so it must read the same in light/dark.
//
// Use in headers, splash/onboarding, empty states, the "about" sheet.
// Native launcher icon + splash need PNG (Expo requirement) and are set
// separately in app.json — this component is for in-app rendering only.
//
// Props:
//   size — square edge in dp (default 40)
// ============================================================

import React from "react";
import { SvgXml } from "react-native-svg";

const STORE_LOGO_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="115" height="115" fill="none" viewBox="0 0 115 115"><path fill="#4683bb" d="M0 70a18.14 18.14 0 0 0 6.874 14.23L45.784 115H18c-9.941 0-18-8.105-18-18.103zm115 26.897c0 9.998-8.059 18.103-18 18.103H70.782l37.582-30.773A18.14 18.14 0 0 0 115 70.19z"/><path fill="#f89047" fill-rule="evenodd" d="M97 0c9.941 0 18 8.059 18 18v46.229c0 5.353-2.384 10.43-6.503 13.85l-39.099 32.459a18 18 0 0 1-22.876.097l-39.9-32.553A18 18 0 0 1 0 64.135V18C0 8.059 8.059 0 18 0zM58 8C35.909 8 18 25.909 18 48s17.909 40 40 40 40-17.909 40-40S80.091 8 58 8" clip-rule="evenodd"/><path fill="#f89047" d="m64.276 52.002-6.971 6.747-6.806-1.07z"/><path fill="#f89047" d="m64.276 52.002-6.971 6.747.797 6.37z"/><path fill="#4683bb" d="M58.277 42.222c8.59 0 15.555 6.84 15.555 15.278 0 8.437-15.551 27.493-15.555 27.5-.006-.007-15.555-19.063-15.555-27.5s6.963-15.278 15.555-15.278m0 5.833a9.722 9.722 0 1 0 0 19.444 9.722 9.722 0 0 0 0-19.444"/><path fill="#f89047" d="M77.31 28.61c1.005 0 1.854.744 1.967 1.726l4.252 36.725c.267 2.306-1.575 4.328-3.937 4.328h-9.306a69 69 0 0 0 2.862-5.176c1.478-3.01 2.629-6.126 2.629-8.71 0-9.547-7.868-17.224-17.5-17.224s-17.5 7.677-17.5 17.22c0 2.587 1.152 5.703 2.627 8.711a67 67 0 0 0 2.862 5.178h-9.303c-2.365 0-4.204-2.022-3.937-4.328l4.252-36.724a1.97 1.97 0 0 1 1.967-1.725h6.88v4.166a2.92 2.92 0 0 0-1.715 2.638c0 1.61 1.332 2.917 2.97 2.917 1.642 0 2.972-1.307 2.972-2.917a2.9 2.9 0 0 0-1.31-2.421V28.61h18.471v4.386a2.9 2.9 0 0 0-1.313 2.42c0 1.61 1.33 2.916 2.971 2.916s2.971-1.307 2.971-2.917c0-1.168-.7-2.174-1.712-2.638V28.61z"/><path stroke="#4683bb" stroke-linecap="round" stroke-width="2.25" d="M47.583 35.416v-9.722a10.694 10.694 0 1 1 21.388 0v9.722"/></svg>`;

interface AppLogoProps {
  size?: number;
}

export default function AppLogo({ size = 40 }: AppLogoProps) {
  return <SvgXml xml={STORE_LOGO_XML} width={size} height={size} />;
}
