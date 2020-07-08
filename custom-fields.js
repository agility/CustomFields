var baseUrl = 'https://agility.github.io/CustomFields/';

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
    self.Template = baseUrl + 'friendly-url/html/friendly-url-template.html';

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

//An example custom field registration function

var ColorPickerFormField = function () {
    /// <summary>The type definition of this Agility Custom Field Type.</summary>
    var self = this;

    /// <field name="Label" type="String">The display name of the Custom Field Type</field>
    self.Label = "Color Picker Using Inline Code";

    /// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
    self.ReferenceName = "ColorPickerUsingInlineCode";

    /// <field name="Render" type="Function">This function gets called each time the input form gets rendered or refreshed. Can be called mulitple times. If dynamically loading in HTML templates, be sure to only load once.</field>
    self.Render = function (options) {a
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
    self.Template = 'https://raw.githubusercontent.com/agility/CustomFields/master/colorpicker/html/colorpicker-template.html';

    /// <field name="DepenenciesJS"> type="Array">The Javscript dependencies that must be loaded before your ViewModel is bound. They will be loaded in the order you specify.</field>
    self.DependenciesJS = [
        { id: 'colorpicker', src: baseUrl + 'colorpicker/js/colorpicker-plugin.js'}
    ];

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

        self.value = options.fieldBinding;
        self.format = false; //optionally set to 'hex', 'rgb', 'rgba' otherwise it will auto-detect
        self.attrBinding = {};

        if (options.fieldSetting.Settings.Required === "True") {
            self.attrBinding['data-parsley-required'] = true;
        }
    }
}

ko.bindingHandlers.colorpicker = {
    init: function (element, valueAccessor) {

        var params = ko.unwrap(valueAccessor());

        function intializeColorPicker() {
            if($.colorpicker && $.isFunction($.colorpicker)) {
                $(element).colorpicker({
                    color: params.value(),
                    format: params.format
                }).on('changeColor', function (e) {
                    var value = $(element).colorpicker('getValue');
                    params.value(value);
                });
                clearInterval(initializeInterval);
            }
        }

        var initializeInterval = setInterval(intializeColorPicker, 300);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (initializeInterval) {
                clearInterval(initializeInterval);
            }
        })

    }
};

ContentManager.Global.CustomInputFormFields.push(new ColorPickerFormField());

//
// API Item Picker
//
var SelectListFromAPICustomField = function(){
    /// <summary>The type definition of this Agility Custom Field Type.</summary>
    var self = this;

    /// <field name="Label" type="String">The display name of the Custom Field Type</field>
    self.Label = "Selectlist from API";

    /// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
    self.ReferenceName = "SelectlistFromAPI";

    /// <field name="Template" type="String">The partial HTML template that represents your custom field. It can be an absolute path to a URL or a reference name to an inline code file in Agility CMS. Your ViewModel will be automatically bound to this template.</field>
    self.Template = baseUrl + "selectlist-from-api/html/selectlist-from-api-template.html";

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
            multiple: false,
            maximumSelectionSize: 1,
            minimumInputLength: 0,
            placeholder: '',
            formatResult: self.formatResult,
            formatSelection: self.formatSelection,

            matcher: function(term, text) {
                return true;
            },

            id: function (obj) {
                //set content of the Agility CMS Content Item
                
                //options.contentItem.Values.ExternalID(obj.ID)
                //options.contentItem.Values.Title(obj.Title);
                //options.contentItem.Values.MyField1(obj.Value1)
                //options.contentItem.Values.MyField2(obj.Value2)
                //etc...    		            
                
                //return the ID
                return obj.ID; 
            },

            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "https://{you-api-url}",
                dataType: 'json',
                type: "post",
                quietMillis: 250,
                originalValue: ko.unwrap(options.contentItem.Values.ExternalID()),
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
                var val = ko.unwrap(options.fieldBinding);
                var label = ko.unwrap(options.contentItem.Values.Title);

                if(val && label) {
                    var data = {
                        Value: val,
                        Label: label
                    };

                    callback(data);
                }
            },
            allowClear: false,
            dropdownCssClass: "bigdrop"
        };
    }
}

ContentManager.Global.CustomInputFormFields.push(new SelectListFromAPICustomField());

var VimeoVideoFormField = function () {
    var self = this;

    self.Label = "Vimeo Video";
    self.ReferenceName = "VimeoVideo";

    self.Render = function (options) {
        /// <summary>
        ///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
        /// </summary>
        /// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>

        //set the related fields
        var titleField = "VideoTitle";

        //get our base element
        var selector = ".vimeo-video";
        var $pnl = $(selector, options.$elem);

        //summary: 
        /* 
         * -> get the html template to render the selected video (including the iframe)
         *      -> when empty, displays a text field that accepts a video ID
         *      -> template will load an emebed of the video, along with the Title, Description and Thumbnail
         *      -> actions will include: Remove and Refresh
         * 
         */

        if ($pnl.size() == 0) {

            //pull down the html template and load it into the element
            $.get("https://dehd7rclpxx3r.cloudfront.net/custom-input/Vimeo/VimeoVideo-CustomFieldType.html", function (htmlContent) {

                options.$elem.append(htmlContent)

                $pnl = $(selector, options.$elem);


                //bind our viewmodel to this
                var viewModel = new function () {
                    var self = this;
                    
                    //our model
                    self.defaultBinding = {
                        video_id: ko.observable(null),
                        title: ko.observable(null),
                        description: ko.observable(null),
                        html: ko.observable(null),
                        thumbnail_url: ko.observable(null),
                        duration: ko.observable(null),
                        author_name: ko.observable(null)
                    }

                    self.fieldBinding = ko.observable(null);

                    //init a default if null
                    if (options.fieldBinding() == null || options.fieldBinding() == "") {
                        var copy = self.defaultBinding;
                        self.fieldBinding(copy); //init defaults
                    } else {
                        //set observables on the existing binding properties
                        var existingBinding = ko.mapping.fromJSON(options.fieldBinding());
                        self.fieldBinding(existingBinding);
                    }

                    //whenever any sub-property in the fieldBinding changes update the main field binding in the model
                    ko.computed(function () {
                        return ko.mapping.toJSON(self.fieldBinding);
                    }).subscribe(function () {
                        var fieldBindingJSON = ko.mapping.toJSON(self.fieldBinding());
                        options.fieldBinding(fieldBindingJSON);
                    });

                    self.oEmbedAPI = 'https://vimeo.com/api/oembed.json';

                    self.videoUrlFormat = 'https://vimeo.com/##videoKey##';

                    self.videoUrl = function () {
                        //format the request url
                        var videoUrl = self.videoUrlFormat.replace('##videoKey##', self.fieldBinding().video_id());
                        return videoUrl;
                    }

                    self.thumbnailUrlSmall = ko.computed(function () {
                        //returns a small thumbnail to display in the manager
                        var thumb = self.fieldBinding().thumbnail_url();

                        if (thumb != null) {
                            thumb = thumb.replace('_1280', '_320');
                        }

                        return thumb;
                    });

                    self.formattedDuration = ko.computed(function () {
                        //returns a formatted duration
                        
                        var duration = self.fieldBinding().duration();

                        if (duration != null) {
                            duration = duration + ' (seconds)';
                        }

                        return duration;
                    });

                    self.removeVideo = function () {
                        //confirms if user wants to remove video, if so clear all values
                        ContentManager.ViewModels.Navigation.messages().show("Do you wish to remove this Video?", "Remove Video",
                           ContentManager.Global.MessageType.Question, [{
                               name: "Remove",
                               defaultAction: true,
                               callback: function () {

                                   self.fieldBinding().title(null);
                                   self.fieldBinding().description(null);
                                   self.fieldBinding().html(null);
                                   self.fieldBinding().thumbnail_url(null);
                                   self.fieldBinding().video_id(null);
                                   self.fieldBinding().duration(null);
                                   self.fieldBinding().author_name(null);

                               }
                           },
                           {
                               name: "Cancel",
                               cancelAction: true,
                               callback: function () {
                                   //do nothing...
                               }
                           }]);
                    };

                    self.isVideoSet = ko.computed(function () {
                        if (self.fieldBinding().video_id() != null && self.fieldBinding().html() != null) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    self.refreshVideo = function () {
                        ContentManager.ViewModels.Navigation.messages().show("Refreshing will overwrite all Video data in Agility with the latest content from Vimeo. Are you sure you want to refresh the content?", "Refresh Video",
                           ContentManager.Global.MessageType.Question, [{
                               name: "Refresh",
                               defaultAction: true,
                               callback: function () {

                                   self.getOEmbed();

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

                    self.getOEmbed = function () {

                        var reqUrl = self.oEmbedAPI + '?url=' + self.videoUrl() + '&callback=?';
                        $.getJSON(reqUrl, function (response) {

                            //refresh the bindings
                            self.fieldBinding().title(response.title);
                            self.fieldBinding().description(response.description);
                            self.fieldBinding().html(response.html);
                            self.fieldBinding().thumbnail_url(response.thumbnail_url);
                            self.fieldBinding().video_id(response.video_id);
                            self.fieldBinding().duration(response.duration);
                            self.fieldBinding().author_name(response.author_name);

                            //look for a Title field in the input form to copy the title to (really only used for the grid view)
                            if (options.contentItem.Values[titleField]) {
                                options.contentItem.Values[titleField](self.fieldBinding().title());
                            }

                        }).fail(function () {

                            ContentManager.ViewModels.Navigation.messages().show("Could not retrieve a Vimeo Video with the ID of '" + self.fieldBinding().video_id() + "'. Please ensure you have the correct ID and the video has not been deleted.", "Vimeo Error",
                               ContentManager.Global.MessageType.Info, [{
                                   name: "OK",
                                   defaultAction: true,
                                   callback: function () {
                                       //do nothing

                                   }
                               }
                               ]);

                        });
                    }

                }

                ko.applyBindings(viewModel, $pnl.get(0));

            });
        }

    }
}

ContentManager.Global.CustomInputFormFields.push(new VimeoVideoFormField());


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
    self.DependenciesJS = [
        { id: 'widen-asset-selector', src: baseUrl + 'widen-asset-selector/html/widen-asset-selector-template.html'}
    ];

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
                self.value(ko.unwrap(existingValue));
                
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
