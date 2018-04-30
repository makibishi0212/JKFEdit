import m from "mithril";

export default {
  oninit: () => {
    console.log("hello world");
  },
  view: () => {
    return [
      m("h1", "About Page"),
      m(
        "a",
        {
          oncreate: m.route.link,
          href: "/"
        },
        "Home"
      ),
      m("div", { class: "ninja" })
    ];
  }
};
