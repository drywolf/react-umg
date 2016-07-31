let UMG = require('UMG');

class UMGText {
  static createUmgElement(element, instantiator) {
    let declaration = UMG.text({});
    let elem = instantiator(declaration);
    return elem;
  }

  static applyProperties(umgElem, reactElem) {
    if (!umgElem)
      return;

    let value = reactElem.props.value || reactElem.props.children;

    if (typeof value === 'string')
      umgElem.SetText(value);
    else if (value)
        console.warn("<text> can only use string values")
  }
}

export default UMGText;
