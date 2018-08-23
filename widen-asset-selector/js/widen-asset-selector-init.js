var WidenCustomField = function () {
    var self = this;

    self.Label = "Widen Asset Selector";
    self.ReferenceName = "WidenAssetSelector";

    self.Render = function (options) {
        /// <summary>
        ///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
        /// </summary>
        /// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>
    }

    /// <field name="Template" type="String">The partial HTML template that represents your custom field. Your ViewModel will be automatically bound to this template.</field>
    self.Template = 'WidenAssetSelectorTemplate';

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
        self.accessToken = "{{access token goes here!}}"; //i.e. cloud/abcdefghifjklmnopqrstuvwxyz
        self.valueAsString = options.fieldBinding;
        self.value = ko.observable(null);
        // {
        //     id: 'string',
        //     external_id: 'string',
        //     filename: 'string',
        //     embedName: 'string',
        //     embed_link: 'string',
        //     embed_code: 'string',
        //     share_link: 'string',
        //     thumbnail_link: 'string'
        // }

        self.contentID = options.contentItem.ContentID;
        self.attrBinding = {};
        self.imageWidth = ko.observable(0);
        self.imageHeight = ko.observable(0);
        self.error = ko.observable(false);

        if (options.fieldSetting.Settings.Required === "True") {
            self.attrBinding['data-parsley-required'] = true;
        }

        self.widenFlyout = function(params) {
            var w = this;
            w.accessToken = params.accessToken;
            w.loading = ko.observable(true);
            w.iFrameUrl = ko.observable(null);

            w.value = params.value;
            w.methods = new function() {
                var m = this;
                m.getIFrameUrl = function() {
                    $.ajax({
                        type: "GET",
                        url: "https://api.widencollective.com/v2/integrations/url",
                        dataType: 'json',
                        headers: {
                            Authorization: "Bearer " + self.accessToken
                        },
                        data: {}
                    }).done(function(resp) {
                        w.iFrameUrl(resp.url);
                    }).fail(function(e) {
                        console.error(e);
                    }).always(function() {
                        w.loading(false);
                    });
                };
            }

            w.methods.getIFrameUrl();
        }

        self.methods = new function() {
            var m = this;
            m.init = function() {

                //set observables on the existing binding properties
                var existingValue = ko.mapping.fromJSON(options.fieldBinding());
                self.value(existingValue());
                
                //whenever any sub-property in the fieldBinding changes update the main field binding in the model
                ko.computed(function () {
                    return ko.mapping.toJSON(self.value);
                }).subscribe(function () {
                    var fieldBindingJSON = null;
                    if(self.value() != null) {
                     fieldBindingJSON = ko.mapping.toJSON(self.value());
                    }
                    options.fieldBinding(fieldBindingJSON);
                });
            },
            m.openFlyout = function() {
                var rightPanel = null;
                var panel = new self.widenFlyout({ accessToken: self.accessToken, value: self.value });
                rightPanel = new ContentManager.ViewModels.RightPanel("widen-flyout", panel);
                ContentManager.ViewModels.Navigation.panelStack.push(rightPanel);
            },
            m.removeAsset = function() {
                self.value(null);
            }
        }

        self.methods.init();

    }
}

ko.bindingHandlers.widenIFrame = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var setAsset = function(event) {
            viewModel.item().value(ko.mapping.fromJS(event.data.items[0]));
            window.removeEventListener('message', setAsset);
            viewModel.close();
        };
        window.addEventListener('message', setAsset);
    }
};

ko.bindingHandlers.checkImage = {
    update: function (element, valueAccessor, allBindings, ignore, bindingContext) {
        var img = $(element);
        var viewModel = bindingContext.$data;
        if (img.is("img")) {
            img.on("load", function () {
                var imgCopy = $("<img>")
                    .attr("src", img.attr("src"))
                    .on("load", function () {
                        viewModel.error(false);

                        viewModel.imageWidth(this.width);
                        viewModel.imageHeight(this.height);
                    });
                // TODO: do we need to display imgCopy?
            });
            img.on("error", function () {
                viewModel.error(true);
            });
        }
    }
};

ContentManager.Global.CustomInputFormFields.push(new WidenCustomField());
