//
// API Item Picker
//
var MarkdownCustomField = function () {
	/// <summary>The type definition of this Agility Custom Field Type.</summary>
	var self = this;

	/// <field name="Label" type="String">The display name of the Custom Field Type</field>
	self.Label = "Markdown";

	/// <field name="ReferenceName" type="String">The internal reference name of the Custom Field Type. Must not contain any special characters.</field>
	self.ReferenceName = "Markdown";

	/// <field name="Render" type="Function">This function runs every time the field is rendered</field>
	self.Render = function (options) {
		/// <summary>
		///  The Render handler for this field.  Create any elements and bindings that you might need, pull down resources.
		///  This method will be called everytime to the field value changes.
		/// </summary>
		/// <param name="options" type="ContentManager.Global.CustomInputFieldParams">The options used to render this field.</param>



		//get our base element
		var $pnl = $(".markdown-field", options.$elem);

		if ($pnl.size() == 0) {
			/*
			Pull in the simple but awesome MD editor here:
			https://github.com/sparksuite/simplemde-markdown-editor
			*/
			var htmlContent = `
				<div class="markdown-field">
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
					<script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
					<textarea data-bind='value:value'></textarea>
				</div>
				`;
			//pull down the html template and load it into the element
			options.$elem.append(htmlContent)

			$pnl = $(".markdown-field", options.$elem);

			//bind our viewmodel to this
			var viewModel = function () {

				/// <summary>The KO ViewModel that will be binded to your HTML template.</summary>
				/// <param name="options" type="Object">
				///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
				///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
				///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value by using this property.</field>
				///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
				///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
				/// </param>
				var self = this;

				self.value = options.fieldBinding; //.extend({ throttle: 500 });

				//TODO: determine a better way to detect if the SimpleMDE object is ready
				setTimeout(function() {

					var simplemde = new SimpleMDE({ element: $("textarea", options.$elem)[0] });
					simplemde.codemirror.on("change", function(){
						self.value(simplemde.value())
					});

				}, 1000)

			}

			ko.applyBindings(viewModel, $pnl.get(0));
		}

	}
}

ContentManager.Global.CustomInputFormFields.push(new MarkdownCustomField());