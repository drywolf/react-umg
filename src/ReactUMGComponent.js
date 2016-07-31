import ReactMultiChild from 'react/lib/ReactMultiChild';
import ReactCurrentOwner from 'react/lib/ReactCurrentOwner';

// import {create, diff} from './attributePayload';
import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

import UmgRoots from './UMGRoots';
import TypeThunks from './components';

const builtin_types = Object.keys(TypeThunks);

// In some cases we might not have a owner and when
// that happens there is no need to inlcude "Check the render method of ...".
const checkRenderMethod = () => ReactCurrentOwner.owner && ReactCurrentOwner.owner.getName()
  ? ` Check the render method of "${ReactCurrentOwner.owner.getName()}".` : '';

/**
 * @constructor ReactUMGComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 */
const ReactUMGComponent = function(element) {
  this.node = null;
  this._mountImage = null;
  this._renderedChildren = null;
  this._currentElement = element;
  this._umgElem = null;

  this._rootNodeID = null;
  this._typeThunk = TypeThunks[element.type];

  if (process.env.NODE_ENV !== 'production') {
    warning(
      builtin_types.indexOf(element.type) > -1,
      'Attempted to render an unsupported generic component "%s". ' +
      'Must be one of the following: ' + builtin_types,
      element.type,
      checkRenderMethod()
    );
  }
};

/**
 * Mixin for UMG components.
 */
ReactUMGComponent.Mixin = {
  // this is called when changing a component in the middle of a tree
  // currently a noop since _nativeNode is not defined.
  getHostNode() {},

  getPublicInstance() {
    // TODO: This should probably use a composite wrapper
    return this;
  },

  unmountComponent() {

    if (this._umgElem)
    {
      this._umgElem.RemoveFromParent();
      this._umgElem.destroy();
    }      
    
    this.unmountChildren();
    this._rootNodeID = null;
    this._umgElem = null;
  },

  updateProperties()
  {
    if (this._typeThunk.applyProperties)
      this._typeThunk.applyProperties(this._umgElem, this._currentElement);
  },

  /**
   *
   */
  mountComponent(
    transaction, // for creating/updating
    rootID, // Root ID of this subtree
    hostContainerInfo, // nativeContainerInfo
    context // secret context, shhhh
  ) {
    let parent = rootID;

    rootID = typeof rootID === 'object' ? rootID._rootNodeID : rootID;
    this._rootNodeID = rootID;

    let umgRoot = parent._umgElem ? parent._umgElem : UmgRoots[rootID];

    this._umgElem = this._typeThunk.createUmgElement(
      this._currentElement,
      elem => umgRoot.add_child(elem)
    );

    this.updateProperties();

    this.initializeChildren(
      this._currentElement.props.children,
      transaction,
      context
    );
    return rootID;
  },

  /**
   * Updates the component's currently mounted representation.
   */
  receiveComponent(
    nextElement,
    transaction,
    context
  ) {
    const prevElement = this._currentElement;
    this._currentElement = nextElement;

    this.updateProperties();

    // TODO: _reconcileListenersUponUpdate(prevElement.props, nextElement.props)
    this.updateChildren(nextElement.props.children, transaction, context);
  },

  initializeChildren(
    children,
    transaction, // for creating/updating
    context // secret context, shhhh
  ) {
    this.mountChildren(children, transaction, context);
  },
};

/**
 * Order of mixins is important. ReactUMGComponent overrides methods in
 * ReactMultiChild.
 */
Object.assign(
  ReactUMGComponent.prototype,
  ReactMultiChild.Mixin,
  ReactUMGComponent.Mixin
);

export default ReactUMGComponent;
