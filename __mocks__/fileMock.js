const React = require("react");

// This is a generic mock for any React component. It renders a simple div.
const mockComponent = props => {
  return React.createElement("div", props);
};

// This is a Proxy that will intercept any request for a named export
// (like 'ShoppingCart') and return our generic mock component instead.
module.exports = new Proxy(
  {},
  {
    get: (target, key) => {
      // This allows both default and named exports to be handled.
      if (key === "__esModule") {
        return false;
      }
      return mockComponent;
    }
  }
);
