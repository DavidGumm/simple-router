const Pages = {};
const Main = {};

const locationHash = () => {
  return window.location.hash.toString();
};

//Validation Code
const Validator = () => {
  this.prototype.validate = (value, rules) => {
    return rules.every(rule => {
      return this[rule](value);
    });
  };

  this.prototype.isString = value => {
    if (typeof value === "string") {
      return true;
    }
    return false;
  };

  this.prototype.isNotEmpty = value => {
    if (value !== "" && value !== null && typeof value !== "undefined") {
      return true;
    }
    return false;
  };

  this.prototype.isInt = value => {
    return Number.isInteger(value);
  };

  this.prototype.isArray = value => {
    return Array.isArray(value);
  };
};

//Validation Code

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
  constructor({ tagName, attributes, textContent, children }) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.textContent = textContent;
    this.children = children;
  }
}

const SimpleRouter = element => {
  if (element.tagName == null || typeof element.tagName != "string") {
    throw NotElementClass("This is not of type Element");
  }

  let elm = document.createElement(element.tagName);

  if (Array.isArray(element.children) && element.children.length > 0) {
    element.children.forEach(child => {
      let childElm = SimpleRouter(child);
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

const routes = () => {
  let returnable = [];

  returnable.push({ route: "#/Home", name: "Home" });
  returnable.push({ route: "#/Code", name: "Code" });
  returnable.push({ route: "#/About", name: "About" });
  returnable.push({ route: "#/Contact", name: "Contact" });
  returnable.push({ route: "#/Help", name: "Help" });

  return returnable;
};

const Page = () => {
  let currentPage = routes().find(item => {
    return item.route == locationHash();
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
  if (locationHash() == "") window.location.hash = routes()[0].route;
  Main.Content = document.querySelector("div.main-content");
  Main.Content.innerHTML = "";
  Main.Content.appendChild(
    SimpleRouter(Pages[locationHash().replace("#/", "")])
  );
  document.head.querySelector("title").innerText = `${document.head.title} /${
    Page().name
  }`;
};

(() => {
  var directory = "Pages/";
  var extension = ".js";
  for (var file of routes()) {
    var path = directory + file.name + extension;
    var script = document.createElement("script");
    script.src = path;
    document.head.appendChild(script);
  }
})();

window.addEventListener("load", window.onhashchange);
