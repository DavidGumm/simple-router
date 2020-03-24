const SimpleRouter = {};

SimpleRouter.Pages = {};
SimpleRouter.Main = {};

SimpleRouter.locationHash = () => {
  return window.location.hash.toString();
};

class Attributes {
  constructor(attributeName, attribute) {
    this.attributeName = attributeName;
    this.attribute = attribute;
  }
}
class TextContent {
  constructor(textContent) {
    this.textContent = textContent;
  }
}

class Element {
  constructor({ tagName, attributes, textContent, children, script }) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.textContent = textContent;
    this.children = children;
    this.script = script;
  }
}

SimpleRouter.Route = element => {
  if (element.tagName == null || typeof element.tagName != "string") {
    throw NotElementClass("This is not of type Element");
  }

  let elm = document.createElement(element.tagName);

  if (Array.isArray(element.children) && element.children.length > 0) {
    element.children.forEach(child => {
      let childElm = SimpleRouter.Route(child);
      elm.appendChild(childElm);
    });
  }

  if (Array.isArray(element.attributes) && element.attributes.length > 0) {
    element.attributes.forEach(attribute => {
      if (
        (attribute.attributeName == null ||
          typeof attribute.attributeName != "string") &&
        (attribute.attribute == null || typeof attribute.attribute != "string")
      ) {
        throw NotElementClass("Attribute is not of type Element");
      }
      elm.setAttribute(attribute.attributeName, attribute.attribute);
    });
  }

  if (element.textContent != null && typeof element.textContent == "string") {
    elm.textContent = element.textContent;
  }
  return elm;
};

SimpleRouter.Finder = (object, path) => {
  let currentLocation = path[0];
  path.shift();

  if (Array.isArray(path) && path.length > 0) {
    return SimpleRouter.Finder(object[currentLocation], path);
  }
  return object[currentLocation];
};

SimpleRouter.Maker = (object, path, value) => {
  let currentLocation = path[0];
  path.shift();
  object[currentLocation] = {};

  if (Array.isArray(path) && path.length > 0) {
    return SimpleRouter.Maker(object[currentLocation], path, value);
  }
  object[currentLocation] = value;

  return object;
};

SimpleRouter.routes = () => {
  let returnable = [];

  returnable.push({ route: "#/Home", name: "Home" });
  returnable.push({ route: "#/Code", name: "Code" });
  returnable.push({ route: "#/About", name: "About" });
  returnable.push({ route: "#/Contact", name: "Contact" });
  returnable.push({ route: "#/Help", name: "Help" });

  return returnable;
};

SimpleRouter.Page = () => {
  let currentPage = SimpleRouter.routes().find(item => {
    return item.route == SimpleRouter.locationHash();
  });
  if (currentPage == undefined) {
    fourZeroFour().element.firstElementChild.innerText = `404 Error, ${window.location.href} not found.`;
    return fourZeroFour();
  }

  return currentPage;
};

// const fourZeroFour = () => {
//   let elm = document.querySelector("section.route[data-route-404]");
//   let returnable = {
//     route: elm.getAttribute("data-route"),
//     name: elm.getAttribute("data-route-name"),
//     element: elm
//   };
//   return returnable;
// };

// const fiveHundred = () => {
//   let elm = document.querySelector("section.route[data-route-500]");
//   let returnable = {
//     route: elm.getAttribute("data-route"),
//     name: elm.getAttribute("data-route-name"),
//     element: elm
//   };
//   return returnable;
// };

window.onhashchange = (newURL, oldURL) => {
  if (SimpleRouter.locationHash() == "")
    window.location.hash = SimpleRouter.routes()[0].route;
  SimpleRouter.Main.Content = document.querySelector("div.main-content");
  SimpleRouter.Main.Content.innerHTML = "";
  SimpleRouter.Main.Content.appendChild(
    SimpleRouter.Route(
      SimpleRouter.Pages[SimpleRouter.locationHash().replace("#/", "")]
    )
  );
  document.head.querySelector("title").innerText = `${document.head.title} /${
    SimpleRouter.Page().name
  }`;
};

(() => {
  var directory = "Pages/";
  var extension = ".js";
  for (var file of SimpleRouter.routes()) {
    var path = directory + file.name + extension;
    var script = document.createElement("script");
    script.src = path;
    document.head.appendChild(script);
  }
})();

window.addEventListener("load", window.onhashchange);
