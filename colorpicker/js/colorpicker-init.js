//An example custom field registration function

var ColorPickerCustomFieldUsingInlineCode = function () {
    /// <summary>The type definition of this Agility Custom Field Type.</summary>
    var self = this;

    /// <field name="Label" type="String">The display name of the Custom Field Type</field>
    self.Label = "Color Picker Using Inline Code";

    /// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
    self.ReferenceName = "ColorPickerUsingInlineCode";

    /// <field name="Render" type="Function">This function gets called each time the input form gets rendered or refreshed. Can be called mulitple times. If dynamically loading in HTML templates, be sure to only load once.</field>
    self.Render = function (options) {
        /// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>
    }

    /// <field name="Template" type="String">The partial HTML template that represents your custom field. Your ViewModel will be automatically bound to this template.</field>
    self.Template = 'BootstrapColorPickerHTML';

    /// <field name="DepenenciesJS"> type="Array">The Javscript dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    self.DependenciesJS = [
        { id: 'bootstrap-colorpicker-inline', src: 'BootstrapColorPickerPlugin' },
        { id: 'color-picker-ko-binding-inline', src: 'BootstrapColorPickerCustomBinding' }
    ];

    /// <field name="DepenenciesCSS" type="Array">The CSS dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    self.DependenciesCSS = [
        { id: 'bootstrap-colorpicker-inline', src: 'BootstrapColorPickerCSS' }
    ];


    /// <field name="ViewModel" type="KO ViewModel">The KO ViewModel that will be binded to your HTML template</field>
    self.ViewModel = function (options) {
        /// <summary>The KO ViewModel that will be binded to your HTML template.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property.</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>

        var self = this;

        self.value = options.fieldBinding;
        self.format = false; //optionally set to 'hex', 'rgb', 'rgba' otherwise it will auto-detect
        self.attrBinding = {};

        if (options.fieldSetting.Settings.Required === "True") {
            self.attrBinding['data-parsley-required'] = true;
        }
    }
}

ContentManager.Global.CustomInputFormFields.push(new ColorPickerCustomFieldUsingInlineCode());
