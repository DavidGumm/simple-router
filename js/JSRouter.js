const Pages = {};

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
const test = {};
const JSRouter = element => {
  if (element.tagName == null || typeof element.tagName != "string") {
    throw NotElementClass("This is not of type Element");
  }

  let elm = document.createElement(element.tagName);
  test.elm = elm;
  test.element = element;
  if (Array.isArray(element.children) && element.children.length > 0) {
    element.children.forEach(child => {
      let childElm = JSRouter(child);
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
  let routDOMs = document.querySelectorAll("section.route[data-route-normal]");
  let returnable = [];

  routDOMs.forEach(elm => {
    returnable.push({
      route: elm.getAttribute("data-route"),
      name: elm.getAttribute("data-route-name"),
      element: elm
    });
  });
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

const fourZeroFour = () => {
  let elm = document.querySelector("section.route[data-route-404]");
  let returnable = {
    route: elm.getAttribute("data-route"),
    name: elm.getAttribute("data-route-name"),
    element: elm
  };
  return returnable;
};
const fiveHundred = () => {
  let elm = document.querySelector("section.route[data-route-500]");
  let returnable = {
    route: elm.getAttribute("data-route"),
    name: elm.getAttribute("data-route-name"),
    element: elm
  };
  return returnable;
};
window.onhashchange = (newURL, oldURL) => {
  if (locationHash() == "") window.location.hash = routes()[0].route;
  routes().forEach(item => {
    item.element.style.display = "none";
  });
  fourZeroFour().element.style.display = "none";
  fiveHundred().element.style.display = "none";

  Page().element.style.display = "block";
  document.head.querySelector("title").innerText = `${document.head.title} - ${
    Page().name
  }`;
};

window.addEventListener("load", window.onhashchange);
