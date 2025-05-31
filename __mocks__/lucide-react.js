// __mocks__/lucide-react.js
import React from "react";

// A simple dummy component to stand in for any icon
const DummyIcon = props => React.createElement("div", props);

// Use a Proxy to return our dummy component for any icon requested
module.exports = new Proxy(
  {},
  {
    get: () => DummyIcon
  }
);
