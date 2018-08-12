var FriendlyURLFormField = function () {
    var self = this;

    self.Label = "Friendly URL";
    self.ReferenceName = "FriendlyURL";

    self.Render = function (options) {
        /// <summary>
        ///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
        /// </summary>
        /// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>
    }

    /// <field name="Template" type="String">The partial HTML template that represents your custom field. Your ViewModel will be automatically bound to this template.</field>
    self.Template = 'FriendlyURLTemplate';

    /// <field name="DepenenciesJS"> type="Array">The Javscript dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    self.DependenciesJS = [];

    /// <field name="DepenenciesCSS" type="Array">The CSS dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    self.DependenciesCSS = [];


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
        self.relatedField = "Title"; //the other field value we want to make friendly
        self.value = options.fieldBinding;
        self.contentID = options.contentItem.ContentID;
        self.attrBinding = {};

        if (options.fieldSetting.Settings.Required === "True") {
            self.attrBinding['data-parsley-required'] = true;
        }


        self.makeFriendlyString = function (s) {
            if (s) {
                var r = s.toLowerCase();
                r = r.replace(new RegExp("\\s", 'g'), "-");
                r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
                r = r.replace(new RegExp("æ", 'g'), "ae");
                r = r.replace(new RegExp("ç", 'g'), "c");
                r = r.replace(new RegExp("[èéêë]", 'g'), "e");
                r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
                r = r.replace(new RegExp("ñ", 'g'), "n");
                r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
                r = r.replace(new RegExp("œ", 'g'), "oe");
                r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
                r = r.replace(new RegExp("[ýÿ]", 'g'), "y");

                r = r.replace(new RegExp("[^\\w\\-@-]", 'g'), "-");
                r = r.replace(new RegExp("--+", 'g'), "-");


                if (r.lastIndexOf("-") > 0 && r.lastIndexOf("-") == r.length - 1) {
                    r = r.substring(0, r.length - 1);
                }
            }

            return r;
        };

        self.regenerateUrl = function () {
            ContentManager.ViewModels.Navigation.messages().show("By changing the URL you could create broken links.\nWe recommend you add in a URL redirection from the old URL to the new URL.\nAre you sure you wish to continue?", "Re-generate URL",
                ContentManager.Global.MessageType.Question, [{
                    name: "OK",
                    defaultAction: true,
                    callback: function () {
                        var friendlyStr = self.makeFriendlyString(options.contentItem.Values[self.relatedField]());
                        self.value(friendlyStr);
                    }
                },
                {
                    name: "Cancel",
                    cancelAction: true,
                    callback: function () {
                        //do nothing...
                    }
                }]);
        }

        //subscribe to the related field changes
        options.contentItem.Values[self.relatedField].subscribe(function (newVal) {
            //auto generate if this is a new item
            if (options.contentItem.ContentID() < 0) {
                var friendlyStr = self.makeFriendlyString(newVal);
                self.value(friendlyStr);
            }

        });

    }
}

ContentManager.Global.CustomInputFormFields.push(new FriendlyURLFormField());
