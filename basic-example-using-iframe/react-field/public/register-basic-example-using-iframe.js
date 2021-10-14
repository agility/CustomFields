var BasicCustomField = function() {

    var self = this;
    self.Label = "Basic Custom Field";
    self.ReferenceName = "BasicCustomField";
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
            iFrameUrl: 'http://localhost:3000/',
            iFrameWidth: '100%',
            iFrameHeight: '500px',
            iFrameClassName: 'basic-custom-field'
        })
    }
}

ContentManager.Global.CustomInputFormFields.push(new BasicCustomField());

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

    //set up the child iframe to render the field
    var iframe = document.createElement('iframe');
    iframe.className = params.iFrameClassName;
    iframe.width = params.iFrameWidth;
    iframe.height = params.iFrameHeight;
    iframe.src = params.iFrameUrl;
    iframe.onload = function() {
        console.log(params.fiedLabel + ' (from CMS) => Iframe Loaded')
    }

    //render the iframe
    params.fieldOptions.$elem.html(iframe);

    //listen for all iframe messages
    window.addEventListener("message", function (e) {
        debugger;
        //only process messages from the child iframe
        if(e.origin !== iFrameOrigin) return;

        switch (e.data.type) {
            case 'fieldIsReady':
                console.log(params.fieldLabel + ' (from CMS) => Sending auth and fieldValue message');
                //send a message to the child iframe with the details of this field
                iframe.contentWindow.postMessage({
                    message: {
                        auth: {
                            guid: config.Guid,
                            websiteName: config.WebsiteName,
                            securityKey: config.SecurityKey,
                            languageCode: languageCode,
                            location: 'USA', //or 'CANADA'
                        },
                        fieldValue: ko.unwrap(params.fieldOptions.fieldBinding),
                        fieldLabel: params.fieldLabel,
                        fieldReferenceName: params.fieldReferenceName,
                        origin: window.location.href

                    },
                    type: 'setInitialProps'
                }, iFrameOrigin)

                break
            case 'setNewValueFromCustomField':
                params.fieldOptions.fieldBinding(e.data.message);
                break;
            case 'setHeightCustomField':
                iframe.height = e.data.message + "px"
                break;

            default:
                //do nothing...
                console.log("not handled", e.data)
                break;
        }

    }, false);
    
}