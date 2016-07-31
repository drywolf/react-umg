let UMG = require('UMG');

class UMGHorizontalBox {
  static createUmgElement(element, instantiator) {
    let declaration = UMG.span({});
    let elem = instantiator(declaration);
    return elem;
  }
}

export default UMGHorizontalBox;
