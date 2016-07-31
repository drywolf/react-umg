import ReactUMGMount from './ReactUMGMount';
import * as ReactUMGComponents from './components';

export * from './components';
export const render = ReactUMGMount.render;
export const unmountComponentAtNode = ReactUMGMount.unmountComponentAtNode;

const ReactUMG = Object.assign(
  {},
  {
    render: ReactUMGMount.render,
    unmountComponentAtNode: ReactUMGMount.unmountComponentAtNode,
  },
  ReactUMGComponents
);

export default ReactUMG;
