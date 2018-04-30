import m from "mithril";

export default {
  oninit: () => {
    console.log("hello world");
  },
  view: () => {
    return [
      m("h1", "Hello Page"),
      m(
        "a",
        {
          oncreate: m.route.link,
          href: "/about"
        },
        "About"
      )
    ];
  }
};
