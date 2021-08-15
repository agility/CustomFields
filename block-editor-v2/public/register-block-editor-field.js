var BlockEditorCustomField = function() {
    var self = this;
    self.Label = "Block Editor (JSON)";
    self.ReferenceName = "BlockEditorJSON";
    self.Render = function (options) {
        /// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
        /// <param name="options" type="Object">
        ///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
        ///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
        ///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
        ///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
        ///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
        /// </param>

		var $pnl = $(".rt-field", options.$elem);

		if ($pnl.size() == 0) {

             var row = $(options.$elem).parents(".row")
			// $(".col-lg-8", row).addClass("col-lg-12").removeClass("col-lg-8")
			// $(".col-lg-4", row).addClass("hidden")
			 $(".tab-CONTENT-tab", row).css("padding", 0)

			var url = 'http://localhost:3000';
            //var url = 'https://agilitycms-block-editor-custom-field.vercel.app/';
			var iframe = document.createElement('iframe');
			iframe.className = "rt-field";
			iframe.width = '100%';
			iframe.height = '500px';
			iframe.src = url;
			iframe.onload = function() {
				console.log('Block Editor *CMS* => Iframe Loaded')
			}
			options.$elem.html(iframe);

			window.addEventListener("message", function (e) {

				var messageType = e.data.type

				switch (messageType) {
					case 'fieldIsReady':
						var config = ContentManager.ViewModels.Navigation.globalConfig();
						console.log('Block Editor *CMS* => Sending Auth and fieldValue message');
						iframe.contentWindow.postMessage({
							message: {
								auth: {
									guid: config.Guid,
									websiteName: config.WebsiteName,
									securityKey: config.SecurityKey,
									languageCode: ContentManager.ViewModels.Navigation.currentLanguageCode(),
									location: "USA" //or CANADA
								},
								fieldValue: ko.unwrap(options.fieldBinding)
							},
							type: 'setInitialProps'
						}, url)

						break
					case 'setNewValueFromCustomField':
						options.fieldBinding(e.data.message);
						break;
					case 'setHeightCustomField':
						iframe.height = e.data.message + "px"
						break;

					default:
						//do nothing...
						console.log("not handled", e.data)
				}


			}, false);

		}

    }
}

ContentManager.Global.CustomInputFormFields.push(new BlockEditorCustomField());