# Agility Custom Fields

This repo serves as an example of how to build custom field types for Agility CMS.

- Build your own re-usable field types
- Compatible with any Agility instance, module or content input form
- Use HTML, CSS and JS
- Content Manager Development Mode for testing
- Integrate with CMS UI
- Code hosted within Agility or externally

## Examples
1. [Friendly URL field](friendly-url) - Auto-generates a friendly URL value based off another text field

2. [Color Picker field](colorpicker) - Allows editors to select a color from a color-picker and save the value as rgba/hex 

## How it Works
On load, the Content Manager will check for the existence of a a single **Input Form Customization** JS file. If one has been set, the JS will be executed and consequently register each Custom Field declaration you have within the file. This will tell the Content Manager which custom fields are available for use, and allow you add a custom field to any content/module definition.

When a custom field is rendered within a content/module input form in the browser, your custom code is executed. A custom field typically includes your registration JS function (including the code that is executed when the field is rendered) and a reference to an HTML file representing your presentation layer.

## Setup

### Register an Input Form Customization JS File
You **must** have an **Input Form Customization** JS file referenced in the Content Manager. This can be found in **Settings > Development Framework**.

*IMAGE*

First thing you need to decide is whether your JS file will be stored and managed within Agility (via Inline Code) or hosted externally.

Inline Code:
- Built-in code editor within the browser
- Code stored in high availability Agility CDN over a dynamic URL
- Has version history

Custom Script URL:
- Can be deployed anywhere
- Easier to intergrate into source control and CI/D pipelines
- Use your own IDE

#### Input Form Customization File Format
This file is comprised of one or more custom field function declarations and its registration. 

The Content Manager uses [KnockoutJS](http://knockoutjs.com/) for declaritive bindings, automatic ui refresh, dependancy tracking, and templating. While you don't need to use knockout to build a custom field, you will still likely interface with Content Manager knockout observable objects such as *contentItem* and *fieldBinding*. It is recommended to have a basic understanding of how Knockout observables work.

**Boilerplate Custom Field Function Declaration:**
```javascript
var CustomFieldFunctionDeclaration = function () {

    this.Label = "Sample Custom Field"; //[Requried] the name of the custom field as will appear in content/module def form builder
    this.ReferenceName = "SampleCustomField"; //[Required] the reference name of the custom field for internal purposes

    this.Render = function (options) {
        /// <summary>[Optional] This function is called whenever the field is rendered in an input form - this includes after the item has been saved and the field is re-rendered.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property - i.e. fieldBinding('new val')</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Required', 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>
    }

    /// <field name="Template" type="String">[Optional] The absoulte URL to an HTML template that represents your custom field, or the referencename to an Inline Code file. Your ViewModel will be automatically bound to this template.</field>
    this.Template = 'https://domain.com/html/somefile.html';

    /// <field name="DepenenciesJS"> type="Array">[Optional] The Javscript dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    this.DependenciesJS = [
        { id: 'somejs-reference-name', src: 'https://domain.com/js/somefile.js' } //src is an absolute URL to a JS file, or the referencename to an Inline Code file.
    ];

    /// <field name="DepenenciesCSS" type="Array">[Optional] The CSS dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    this.DependenciesCSS = [
        { id: 'somecss-reference-name', src: 'https://domain.com/css/somefile.css' } //src is an absolute URL to a CSS file, or the referencename to an Inline Code file.
    ];


    /// <field name="ViewModel" type="KO ViewModel">The KO ViewModel that will be binded to your HTML template</field>
    this.ViewModel = function (options) {
        /// <summary>[Optional] The KO ViewModel that will be binded to your HTML template.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property.</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>

        this.value = options.fieldBinding; //reference the field KO observable value
        this.contentID = options.contentItem.ContentID; //set the contentID of the current loaded item (NewItem = -1)
        this.attrBinding = {}; //pass any custom attributes to the input field

        if (options.fieldSetting.Settings.Required === "True") {
            //if this field is marked as required, add a required parsley attribute
            this.attrBinding['data-parsley-required'] = true;
        }

    }
}
```

**Boilerplate HTML Template:**
```html
<div class="sample-field">
    <input type="text" class="form-control" data-bind="value: value, attr: attrBinding" />
</div>
```

**Register the Custom Field:**
```javascript
ContentManager.Global.CustomInputFormFields.push(new CustomFieldFunctionDeclaration());
```


