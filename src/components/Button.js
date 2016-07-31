let UMG = require('UMG');

class UMGButton {
  static createUmgElement(element, instantiator) {
    let declaration = UMG(Button,
      {
        OnClicked: _ => {
          if (element.props.onClick)
            element.props.onClick();
        }
      });

    let elem = instantiator(declaration);
    return elem;
  }
}

export default UMGButton;
