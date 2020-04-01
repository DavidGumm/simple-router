SimpleRouterJS.Pages.Error = props => {
  return {
    tagName: "section",
    children: [
      {
        tagName: "h1",
        textContent: `${props.Code} Error, ${props.Reason}.`
      }
    ]
  };
};
