"use strict";
var SimpleRouter = function() {
  this.Pages = {};
  this.Pages.Error = {};
  this.Parent = {};
  // this.LocationHash();
  // this.Finder();
  // this.Maker();
  // this.Routes();
  // this.Page();

  window.addEventListener("hashchange", this.HashMonitor());
  window.addEventListener("load", this.HashMonitor());
};

SimpleRouter.prototype.LocationHash = function() {
  return window.location.hash.toString();
};

SimpleRouter.prototype.HashMonitor = function() {
  if (this.LocationHash() == "") {
    window.location.hash = this.Routes[0].route;
  }
  let page = this.Page();
  this.Main.Content = document.querySelector(page.parent);
  if (typeof this.Main.Content == "HTMLElement") {
    this.Main.Content.innerHTML = "";
    this.Main.Content.appendChild(
      this.RenderElement(this.Pages[this.LocationHash().replace("#/", "")])
    );
    document.head.querySelector("title").innerText = `${document.head.title} /${
      this.Page().name
    }`;
  }
};

SimpleRouter.prototype.RenderElement = function(element) {
  if (element != undefined) {
    test.element = element;
    if (element().tagName == null || typeof element().tagName != "string") {
      throw NotElementClass("This is not of type Element");
    }

    let elm = document.createElement(element.tagName);

    if (Array.isArray(element.children) && element.children.length > 0) {
      element.children.forEach(child => {
        let childElm = this.RenderElement(child);
        elm.appendChild(childElm);
      });
    }

    if (Array.isArray(element.attributes) && element.attributes.length > 0) {
      element.attributes.forEach(attribute => {
        if (
          (attribute.attributeName == null ||
            typeof attribute.attributeName != "string") &&
          (attribute.attribute == null ||
            typeof attribute.attribute != "string")
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
  }
};

SimpleRouter.prototype.Finder = function(object, path) {
  let currentLocation = path[0];
  path.shift();

  if (Array.isArray(path) && path.length > 0) {
    return this.Finder(object[currentLocation], path);
  }
  return object[currentLocation];
};

SimpleRouter.prototype.Maker = function(object, path, value) {
  let currentLocation = path[0];
  path.shift();
  object[currentLocation] = {};

  if (Array.isArray(path) && path.length > 0) {
    return this.Maker(object[currentLocation], path, value);
  }
  object[currentLocation] = value;

  return object;
};

SimpleRouter.prototype.Routes = [
  { route: "#/Home", name: "Home", Props: {} },
  { route: "#/Code", name: "Code", Props: {} },
  { route: "#/About", name: "About", Props: {} },
  { route: "#/Contact", name: "Contact", Props: {} },
  { route: "#/Help", name: "Help", Props: {} }
];

SimpleRouter.prototype.Page = function() {
  let currentPage = this.Routes.find(item => {
    return item.route == this.LocationHash();
  });
  if (currentPage == undefined) {
    return {
      route: "#/Error",
      name: "Error",
      Props: { Code: HTMLStatusCodes.NotFound, Reason: "Page not found." }
    };
  }
  return currentPage;
};
