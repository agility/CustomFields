//
// API Item Picker
//

var baseUrl = "http://localhost:64661";

var SelectListFromAPICustomField = function(){
    /// <summary>The type definition of this Agility Custom Field Type.</summary>
    var self = this;

    /// <field name="Label" type="String">The display name of the Custom Field Type</field>
    self.Label = "Selectlist from API";

    /// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
    self.ReferenceName = "SelectlistFromAPI";

    /// <field name="Template" type="String">The partial HTML template that represents your custom field. It can be an absolute path to a URL or a reference name to an inline code file in Agility CMS. Your ViewModel will be automatically bound to this template.</field>
    self.Template = baseUrl + "/html/selectlist-from-api-template.html";

    /// <field name="Render" type="Function">This function runs every time the field is rendered</field>
    self.Render = function(options){
      //nothing needed here...
    }
    
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

    self.ajaxRequest = null;

        self.selectedValue = options.fieldBinding.extend({ throttle: 500 });

        self.formatResult = function (item) {
            return item.Label;
        };

        self.formatSelection = function (item) {
            return item.Label;
        };
        self.ajaxRequest = null;

        self.select2 = {
            label: 'API Item ID',
            readOnly: false,
            value: options.fieldBinding,
            multiple: true,
            maximumSelectionSize: 3,
            minimumInputLength: 0,
            placeholder: '',
            formatResult: self.formatResult,
            formatSelection: self.formatSelection,

            matcher: function(term, text) {
                return true;
            },

            id: function (obj) {
                //save the value for each selected item with the label and id ({id}|{label}) so it can be parsed out later
                return obj.Value + "|" + obj.Label; 
            },

            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: baseUrl + "/data/mockApiResponse.json",
                dataType: 'json',
                type: "GET",
                quietMillis: 250,
                originalValue: ko.unwrap(options.fieldBinding),
                term: "",
                data: function (term, page, params) {

                    return {
                        q: term, // search term
                        //other params...
                        languageCode: ContentManager.ViewModels.Navigation.currentLanguageCode()
                    };
                },
                results: function (data, page) { 
                    //ensure data has both a 'Label' and 'Value' property in each item in the array
                    return {
                        results: data
                    };
                },
                current: function(data){
                    console.log('current', data);
                },
                cache: true
            },
            initSelection: function (element, callback) {
                var data = [];
                var ids = ko.unwrap(options.fieldBinding);
                $(ids.split(",")).each(function () {
                    data.push({Label: this.split("|")[1], Value: this.split("|")[0]});
                });
                callback(data);
            },
            allowClear: false,
            dropdownCssClass: "bigdrop"
        };
    }
}

ContentManager.Global.CustomInputFormFields.push(new SelectListFromAPICustomField());
