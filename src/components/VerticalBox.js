let UMG = require('UMG');

class UMGVerticalBox {
  static createUmgElement(element, instantiator) {
    let declaration = UMG.div({});
    let elem = instantiator(declaration);
    return elem;
  }
}

export default UMGVerticalBox;
