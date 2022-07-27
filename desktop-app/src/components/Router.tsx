import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { Urls } from "../enums";
import { Hero, Twitch, Youtube } from "./pages";

export const Router: React.FC = () => (
  <HashRouter>
    <Routes>
      <Route index element={<Hero />} />
      <Route path={Urls.Twitch} element={<Twitch />} />
      <Route path={Urls.Youtube} element={<Youtube />} />
    </Routes>
  </HashRouter>
);
