var TagValueCustomField = function() {

    var self = this;
    self.Label = "Tag Value Custom Field";
    self.ReferenceName = "TagValueCustomField";
    self.Render = function (options) {
        /// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>
        setupIframe({
            fieldLabel: self.Label,
            fieldReferenceName: self.ReferenceName,
            fieldOptions: options,
            //the absolute URL to your custom fields app (use https://localhost:3000/ for testing locally in Development Mode)
            iFrameUrl: 'https://agility-tag-value-custom-field-example-hbi8csaft-agility-cms.vercel.app/',
            iFrameWidth: '100%',
            iFrameHeight: 'auto',
            iFrameClassName: 'tag-value-custom-field',
            customProps: {
                //the reference name of the content list in Agility you want to pull as options for the tags
                tagsContentReferenceName: 'Tags',
                //your preview API key that will be used to retrieve content from Agility (https://manager.agilitycms.com/settings/apikeys)
                apiKey: 'defaultpreview.7dc1052104d1f593efd8f7934e913f70e5f7615a6e80970b5f18f4ebe6a0810c'
            }
        })
    }
}

ContentManager.Global.CustomInputFormFields.push(new TagValueCustomField());

var setupIframe = function(params) {

    var $pnl = $("." + params.iFrameClassName, params.fieldOptions.$elem);

    if ($pnl.size() > 0) return; //already rendered...

    var iFrameOrigin = function() {
        var pathArray = params.iFrameUrl.split('/');
        var protocol = pathArray[0];
        var host = pathArray[2];
        var origin = protocol + '//' + host;
        return origin
    }();

    var config = ContentManager.ViewModels.Navigation.globalConfig();
    var languageCode = ContentManager.ViewModels.Navigation.currentLanguageCode();
    var fieldName = params.fieldOptions.fieldSetting.FieldName;
    var fieldID = params.fieldOptions.fieldSetting.FieldID;

    //set up the child iframe to render the field
    var iframe = document.createElement('iframe');
    iframe.className = params.iFrameClassName;
    iframe.width = params.iFrameWidth;
    iframe.height = params.iFrameHeight;
    iframe.src = params.iFrameUrl + '?fieldName=' + fieldName + '&fieldID=' + fieldID;
    iframe.onload = function() {}

    //render the iframe
    params.fieldOptions.$elem.html(iframe);

    //listen for all iframe messages
    window.addEventListener("message", function (e) {
        
        //only process messages from the child iframe
        if(e.origin !== iFrameOrigin) return;
        
        switch (e.data.type) {
            case 'fieldReady_for_' + fieldName + '_' + fieldID:
                console.log(fieldName + '['+ params.fieldOptions.fieldSetting.Settings.CustomFieldType + '] (from CMS) => Sending auth and fieldValue message');
                //send a message to the child iframe with the details of this field
                iframe.contentWindow.postMessage({
                    message: {
                        auth: {
                            guid: config.Guid,
                            websiteName: config.WebsiteName,
                            securityKey: config.SecurityKey,
                            languageCode: languageCode,
                            //'USA' or 'CANADA',
                            location: 'USA'
                        },
                        fieldValue: ko.unwrap(params.fieldOptions.fieldBinding),
                        fieldLabel: params.fieldOptions.fieldSetting.Label,
                        fieldName: fieldName,
                        fieldID: fieldID,
                        fieldReferenceName: params.fieldOptions.fieldSetting.Settings.CustomFieldType,
                        origin: window.location.href,
                        customProps: params.customProps
                    },
                    type: 'setInitialProps_for_' + fieldName + '_' + fieldID
                }, "*")

                break
            case 'setNewValue_for_' + fieldName + '_' + fieldID:
                params.fieldOptions.fieldBinding(e.data.message);
                break;
            case 'setHeight_for_' + fieldName + '_' + fieldID:
                iframe.height = e.data.message + "px"
                break;

            default:
                //do nothing...
                break;
        }

    }, false);
    
}