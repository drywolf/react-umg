/**
 * React UMG Default Injection
 */
import './devtools/InitializeJavaScriptAppEngine';
import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';
import ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment';
import ReactUMGReconcileTransaction from './ReactUMGReconcileTransaction';
import ReactUMGComponent from './ReactUMGComponent';
import ReactUMGEmptyComponent from './ReactUMGEmptyComponent';

function inject() {
  ReactInjection.HostComponent.injectGenericComponentClass(
    ReactUMGComponent
  );

  // Maybe?
  ReactInjection.HostComponent.injectTextComponentClass(
    (instantiate) => new ReactUMGEmptyComponent(instantiate)
  );

  ReactInjection.Updates.injectReconcileTransaction(
    ReactUMGReconcileTransaction
  );

  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.EmptyComponent.injectEmptyComponentFactory(
    (instantiate) => new ReactUMGEmptyComponent(instantiate)
  );

  ReactComponentEnvironment.processChildrenUpdates = function() {};
  ReactComponentEnvironment.replaceNodeWithMarkup = function() {};
  ReactComponentEnvironment.unmountIDFromEnvironment = function() {};
}

export default {
  inject,
};
