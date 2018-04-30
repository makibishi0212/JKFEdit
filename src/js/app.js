import "../scss/style.scss";
import add from "./modules/add";
import m from "mithril";

import Hello from "./components/hello";
import About from "./components/about";

m.route(document.querySelector(".mithril-body"), "/", {
  "/": Hello,
  "/about": About
});
