let UMG = require('UMG');

class UMGInput {
    static createUmgElement(element, instantiator) {
        let declaration = UMG(EditableTextBox,
            {
                OnTextChanged: text => {
                    if (element.props.onChange)
                        element.props.onChange(text);
                },
                WidgetStyle:
                {
                    'font.font-object': GEngine.SmallFont,
                    'font.size': 20
                },
            });

        let elem = instantiator(declaration);
        return elem;
    }

    static applyProperties(umgElem, reactElem) {
        if (!umgElem)
            return;

        let value = reactElem.props.value;

        if (typeof value === 'string')
            umgElem.SetText(value);
        else if (value)
            console.warn("<input> can only use string values")
    }
}

export default UMGInput;
