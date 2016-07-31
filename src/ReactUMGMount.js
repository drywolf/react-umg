/**
 * React Hardware mount method.
 *
 * @flow
 */

import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactElement from 'react/lib/ReactElement';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactUpdateQueue from 'react/lib/ReactUpdateQueue';
import ReactReconciler from 'react/lib/ReactReconciler';
import shouldUpdateReactComponent from 'react/lib/shouldUpdateReactComponent';
import instantiateReactComponent from 'react/lib/instantiateReactComponent';

import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

import ReactUMGDefaultInjection from './ReactUMGDefaultInjection';

import UMGInstantiator from 'instantiator';

ReactUMGDefaultInjection.inject();

// TODO: externalize management of UMG node meta-data (id, component, ...)
let idCounter = 1;

import UmgRoots from './UMGRoots';
import TypeThunks from './components';

const ReactUMGMount = {
  // for react devtools
  _instancesByReactRootID: {},
  nativeTagToRootNodeID(nativeTag) {
    throw new Error('TODO: implement nativeTagToRootNodeID ' + nativeTag);
  },

  /**
   * Renders a React component to the supplied `container` port.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the pins as necessary to reflect
   * the latest React component.
   */
  render(
    nextElement,
    umgWidget,
    callback
  ) {
    // WIP: it appears as though nextElement.props is an empty object...
    invariant(
      ReactElement.isValidElement(nextElement),
      'ReactUMG.render(): Invalid component element.%s',
      (
        typeof nextElement === 'function' ?
          ' Instead of passing a component class, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        // Check if it quacks like an element
        nextElement != null && nextElement.props !== undefined ?
          ' This may be caused by unintentionally loading two independent ' +
          'copies of React.' :
          ''
      )
    );

    if (umgWidget) {
        const prevComponent = umgWidget.component;

        if (prevComponent) {
            const prevWrappedElement = prevComponent._currentElement;
            const prevElement = prevWrappedElement.props;
            if (shouldUpdateReactComponent(prevElement, nextElement)) {
              // $FlowFixMe
              const publicInst = prevComponent._renderedComponent.getPublicInstance();
              const updatedCallback = callback && function() {
                // appease flow
                if (callback) {
                  callback.call(publicInst);
                }
              };

              ReactUMGMount._updateRootComponent(
                prevComponent,
                nextElement,
                container,
                updatedCallback
              );
              return publicInst;
            } else {
              warning(
                true,
                'Unexpected `else` branch in ReactUMG.render()'
              );
            }
        }
    }

    if (!umgWidget.reactUmgId)
      umgWidget.reactUmgId = idCounter++;

    const rootId = ReactInstanceHandles.createReactRootID(umgWidget.reactUmgId);

    let umgRoot = UmgRoots[rootId];

    if (!umgRoot)
    {
      let typeThunk = TypeThunks[nextElement.type];
      umgRoot = typeThunk.createUmgElement(nextElement, UMGInstantiator);
      
      if (typeThunk.applyProperties)
        typeThunk.applyProperties(umgRoot, nextElement);

      UmgRoots[rootId] = umgRoot;

      umgWidget.SetRootWidget(umgRoot);
    }

    const nextComponent = instantiateReactComponent(nextElement);

    if (!umgWidget.component)
      umgWidget.component = nextComponent;
    
    ReactUpdates.batchedUpdates(() => {
    // Two points to React for using object pooling internally and being good
    // stewards of garbage collection and memory pressure.
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(() => {
      // The `component` here is an instance of your
      // `ReactCustomRendererComponent` class. To be 100% honest, I’m not
      // certain if the method signature is enforced by React core or if it is
      // renderer specific. This is following the ReactDOM renderer. The
      // important piece is that we pass our transaction and rootId through, in
      // addition to any other contextual information needed.

      nextComponent.mountComponent(
        transaction,
        rootId,
        // TODO: what is _idCounter used for and when should it be nonzero?
        {_idCounter: 0},
        {}
      );
      if (callback) {
        callback(nextComponent.getPublicInstance());
      }
    });
    ReactUpdates.ReactReconcileTransaction.release(transaction);
  });

    // needed for react-devtools
    ReactUMGMount._instancesByReactRootID[rootId] = nextComponent;

    return nextComponent.getPublicInstance();
  },

  /**
   * Unmounts a component.
   */
  unmountComponentAtNode(
    container
  ) {
    throw new Error("not implemented yet");

    return true;
  },

  /**
   * Take a component that’s already mounted and replace its props
   */
  _updateRootComponent(
    prevComponent, // component instance already in the DOM
    nextElement, // component instance to render
    container, // firmata connection port
    callback // function triggered on completion
  ) {
    ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
    if (callback) {
      ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
    }

    return prevComponent;
  },

  renderComponent(
    rootID,
    container,
    nextComponent,
    nextElement,
    board, // Firmata instnace
    callback
  ) {

    const component = nextComponent || instantiateReactComponent(nextElement);

    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.
    ReactUpdates.batchedUpdates(() => {
      // Batched mount component
      const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
      transaction.perform(() => {

        component.mountComponent(
          transaction,
          rootID,
          {_idCounter: 0},
          {}
        );
        if (callback) {
          const publicInst = component.getPublicInstance();
          callback(publicInst);
        }
      });
      ReactUpdates.ReactReconcileTransaction.release(transaction);
    });

    return component.getPublicInstance();
  },

  getNode(nativeTag) {
    return nativeTag;
  },

  // // needed for react devtools ?!
  // getID(nativeTag: number): string {
  //   const id = ReactInstanceHandles.getReactRootIDFromNodeID(nativeTag);
  //   console.warn('TODO: ReactUMGMount.getID(%s) ->  %s', nativeTag, id);
  //   return id;
  // },
};

export default ReactUMGMount;
