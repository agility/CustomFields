# Cloudinary + Agility CMS Integration
This is a integration that allows CMS users to browse and select assets from [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/udfxmpuf8euczsps2fnx) to be used in Agility CMS.

It enables [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/udfxmpuf8euczsps2fnx) Image and Video fields.

In order to use this integration, some setup is required.

1. [Install the integration](#install-the-integration)
2. [Create Content Models that use the Cloudinary Image/ Video custom fields](#set-up-content-models-to-use-cloudinary-fields)
3. [Output the cloudinary assets in your digital solution](#output-the-cloudinary-assets-in-your-solution) (i.e. website or app)

## Example
We have an example Next.js site that can be used in conjunction with our [Blog Starter](https://agilitycms.com/starters/blog-with-nextjs).

[Example GitHub Repo](https://github.com/agility/agility-nextjs-cloudinary)


## Requirements
You must have a Cloudinary account as well as an Agility CMS instance.

### Agility CMS ###
[Sign up for an Agility CMS instance](https://agilitycms.com/trial/)

### 🌥🌥🌥 Cloudinary 🌥🌥🌥
- Cloudinary is an amazing tool to help you unleash the full potential of your online media.
- Optimize, transform, and combine your images to create great digital experiences
- Upload and stream high quality adaptive videos from your website
- [Sign up for a free Cloudinary account](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/udfxmpuf8euczsps2fnx)

## Retrieve your Cloudinary API Credentials
1. Login to [Cloudinary](https://cloudinary.com/console/)
2. Locate and Copy the `Cloud name` and `API Key` value from the main dashboard for reference later

## Install the Integration
In order to use the Cloudinary fields, you'll need to register it in your custom scripts file that is connected to your Agility CMS instance (via UI Extensions).

Login to your Agility CMS instance and navigate to UI Extensions.

You may or may not already have a `Custom Fields Script URL`  defined. 

If you have an existing `JavaScript` file defined, then you'll want to append the following contents to that file:

```javascript
/**
 * THIS FILE IS USED FOR THE AGILITY'S CUSTOM FIELDS
 */

var baseUrl = "https://agility.github.io/CustomFields/"

// Set your cloudinary settings here so your custom field can communicate with cloudinary
var cloudinarySettings = {
	cloud_name: '',
	api_key: ''
}

if(!cloudinarySettings.cloud_name || !cloudinarySettings.api_key) {
	console.error('Cloudinary `cloud_name` and `api_key` must be set in your Custom field script.')
}

var CloudinaryVideoField = function () {
	var field = this;
	field.Label = "Cloudinary Video";
	field.ReferenceName = "CloudinaryVideo";
	field.Render = function (options) {
		/// <summary>Function called whenever the form container this Custom Field Type is rendered or refreshed.</summary>
		/// <param name="options" type="Object">
		///     <field name="$elem" type="jQueryElem">The .field-row jQuery Dom Element.</field>
		///     <field name="contentItem" type="ContentItem Object">The entire Content Item object including Values and their KO Observable properties of all other fields on the form.</field>
		///     <field name="fieldBinding" type="KO Observable">The value binding of thie Custom Field Type. Get and set this field's value using this property.</field>
		///     <field name="fieldSetting" type="Object">Object representing the field's settings such as 'Hidden', 'Label', and 'Description'</field>
		///     <field name="readonly" type="boolean">Represents if this field should be readonly or not.</field>
		/// </param>

		var $pnl = $(".cloudinary-video-field", options.$elem);

		if ($pnl.size() == 0) {

			//pull down the html template and load it into the element
			$.get(baseUrl + "cloudinary/cloudinary-video.html", function (htmlContent) {

				options.$elem.append(htmlContent)

				$pnl = $(".cloudinary-video-field", options.$elem);

				$.getScript("https://media-library.cloudinary.com/global/all.js")

				//bind our viewmodel to this
				var viewModel = new function () {
					var self = this;

					//our model
					self.defaultBinding = {
						url: ko.observable(null),
						public_id: ko.observable(null),
						resource_type: ko.observable(null),
						secure_url: ko.observable(null),
						width: ko.observable(null),
						height: ko.observable(null),
						bytes: ko.observable(null),
						duration: ko.observable(null),
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


					self.formattedDuration = ko.computed(function () {
						//returns a formatted duration

						var duration = self.fieldBinding().duration();

						if (duration != null) {
							duration = duration + ' (seconds)';
						}

						return duration;
					});



					self.chooseVideo = function () {
						window.ml = cloudinary.openMediaLibrary({
							cloud_name: cloudinarySettings.cloud_name,
							api_key: cloudinarySettings.api_key,
							insert_caption: "Choose video",
							//inline_container: '.cms-container',
							multiple: false,
							max_files: 1,
							search: { expression: 'resource_type:video' }
						}, {
							insertHandler: function (data) {
								data.assets.forEach(asset => {
									self.fieldBinding().url(asset.url)
									self.fieldBinding().public_id(asset.public_id)
									self.fieldBinding().resource_type(asset.resource_type)
									self.fieldBinding().secure_url(asset.secure_url)
									self.fieldBinding().width(asset.width)
									self.fieldBinding().height(asset.height)
									self.fieldBinding().bytes(asset.bytes)
									self.fieldBinding().duration(asset.duration)

									console.log("Inserted asset:",
										JSON.stringify(asset, null, 2))
								})
							}
						}
						)
					};

					self.editVideo = function () {

						window.ml = cloudinary.openMediaLibrary({
							cloud_name: cloudinarySettings.cloud_name,
							api_key: cloudinarySettings.api_key,
							insert_caption: "Choose video",
							//inline_container: '.cms-container',
							multiple: false,
							max_files: 1,
							asset: { resource_type: "video", type: "upload", public_id: self.fieldBinding().public_id() },
							//search: { expression: 'resource_type:video' }
						}, {
							insertHandler: function (data) {
								data.assets.forEach(asset => {
									self.fieldBinding().url(asset.url)
									self.fieldBinding().public_id(asset.public_id)
									self.fieldBinding().resource_type(asset.resource_type)
									self.fieldBinding().secure_url(asset.secure_url)
									self.fieldBinding().width(asset.width)
									self.fieldBinding().height(asset.height)
									self.fieldBinding().bytes(asset.bytes)
									self.fieldBinding().duration(asset.duration)

									console.log("Inserted asset:",
										JSON.stringify(asset, null, 2))
								})
							}
						}
						)
					};

					self.frameSrc = ko.computed(function () {
						if (self.fieldBinding().public_id() == null) {
							return "about:blank";
						} else {
							return baseUrl + "cloudinary/cloudinary-player.html?id=" + self.fieldBinding().public_id()
						}
					})

					self.isVideoSet = ko.computed(function () {
						if (self.fieldBinding().public_id() != null) {
							return true;
						} else {
							return false;
						}
					});

					self.removeVideo = function () {
						//confirms if user wants to remove video, if so clear all values
						ContentManager.ViewModels.Navigation.messages().show("Do you wish to remove this Video?", "Remove Video",
							ContentManager.Global.MessageType.Question, [{
								name: "Remove",
								defaultAction: true,
								callback: function () {

									self.fieldBinding().url(null)
									self.fieldBinding().public_id(null)
									self.fieldBinding().resource_type(null)
									self.fieldBinding().secure_url(null)
									self.fieldBinding().width(null)
									self.fieldBinding().height(null)
									self.fieldBinding().bytes(null)
									self.fieldBinding().duration(null)

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
				}

				ko.applyBindings(viewModel, $pnl.get(0));

				
			});
		}



	}
}

ContentManager.Global.CustomInputFormFields.push(new CloudinaryVideoField());

var CloudinaryImageField = function () {
	var field = this;
	field.Label = "Cloudinary Image";
	field.ReferenceName = "Cloudinary Image";
	field.Render = function (options) {

		var $pnl = $(".cloudinary-image-field", options.$elem);

		if ($pnl.size() == 0) {

			//pull down the html template and load it into the element
			$.get(baseUrl + "cloudinary/cloudinary-image.html", function (htmlContent) {

				options.$elem.append(htmlContent)

				$pnl = $(".cloudinary-image-field", options.$elem);

				$.getScript("https://media-library.cloudinary.com/global/all.js")


				//bind our viewmodel to this
				var viewModel = new function () {
					var self = this;

					//our model
					self.defaultBinding = {
						url: ko.observable(null),
						public_id: ko.observable(null),
						resource_type: ko.observable(null),
						secure_url: ko.observable(null),
						width: ko.observable(null),
						height: ko.observable(null),
						bytes: ko.observable(null),
						duration: ko.observable(null),
						alt: ko.observable(null),
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


					self.formattedDuration = ko.computed(function () {
						//returns a formatted duration

						var duration = self.fieldBinding().duration();

						if (duration != null) {
							duration = duration + ' (seconds)';
						}

						return duration;
					});



					self.chooseImage = function () {
						window.ml = cloudinary.openMediaLibrary({
							cloud_name: cloudinarySettings.cloud_name,
							api_key: cloudinarySettings.api_key,
							insert_caption: "Choose Image",
							//inline_container: '.cms-container',
							multiple: false,
							max_files: 1,
							search: { expression: 'resource_type:image' }
						}, {
							insertHandler: function (data) {
								data.assets.forEach(asset => {

									self.fieldBinding().url(asset.url)
									self.fieldBinding().public_id(asset.public_id)
									self.fieldBinding().resource_type(asset.resource_type)
									self.fieldBinding().secure_url(asset.secure_url)
									self.fieldBinding().width(asset.width)
									self.fieldBinding().height(asset.height)
									self.fieldBinding().bytes(asset.bytes)


									console.log("Inserted asset:",
										JSON.stringify(asset, null, 2))
								})
							}
						}
						)
					};

					self.editImage = function () {

						window.ml = cloudinary.openMediaLibrary({
							cloud_name: cloudinarySettings.cloud_name,
							api_key: cloudinarySettings.api_key,
							insert_caption: "Choose image",
							//inline_container: '.cms-container',
							multiple: false,
							max_files: 1,
							asset: { resource_type: "image", type: "upload", public_id: self.fieldBinding().public_id() },

						}, {
							insertHandler: function (data) {
								data.assets.forEach(asset => {
									self.fieldBinding().url(asset.url)
									self.fieldBinding().public_id(asset.public_id)
									self.fieldBinding().resource_type(asset.resource_type)
									self.fieldBinding().secure_url(asset.secure_url)
									self.fieldBinding().width(asset.width)
									self.fieldBinding().height(asset.height)
									self.fieldBinding().bytes(asset.bytes)
									self.fieldBinding().duration(asset.duration)

									console.log("Inserted asset:",
										JSON.stringify(asset, null, 2))
								})
							}
						}
						)
					};

					self.thmSrc = ko.computed(function () {
						if (self.fieldBinding().public_id() == null) {
							return null;
						} else {

							return "https://res.cloudinary.com/" + cloudinarySettings.cloud_name + "/image/upload/c_scale,f_auto,w_500/" + self.fieldBinding().public_id() + ".jpg"

						}
					})

					self.isImageSet = ko.computed(function () {
						if (self.fieldBinding().public_id() != null) {
							return true;
						} else {
							return false;
						}
					});

					self.removeImage = function () {
						//confirms if user wants to remove image, if so clear all values
						ContentManager.ViewModels.Navigation.messages().show("Do you wish to remove this Image?", "Remove Image",
							ContentManager.Global.MessageType.Question, [{
								name: "Remove",
								defaultAction: true,
								callback: function () {

									self.fieldBinding().url(null)
									self.fieldBinding().public_id(null)
									self.fieldBinding().resource_type(null)
									self.fieldBinding().secure_url(null)
									self.fieldBinding().width(null)
									self.fieldBinding().height(null)
									self.fieldBinding().bytes(null)
									self.fieldBinding().duration(null)

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
				}

				ko.applyBindings(viewModel, $pnl.get(0));

			});
		}
	}
}

ContentManager.Global.CustomInputFormFields.push(new CloudinaryImageField());
```

If you do not have a `Custom Fields Script URL` file defined, then create a new `JavaScript` file `(i.e. custom-fields.js)` using a text editor and upload this file to any public URL. The easiest way to do this is to upload the file as an Asset in the CMS and reference it by URL.

### Set your Cloudinary API Values
In order for the script to authenticate with your Cloudinary account, you'll need to set the following properties within your `JavaScript` file:
```javascript
...
// Set your cloudinary settings here so your custom field can communicate with cloudinary
var cloudinarySettings = {
	cloud_name: '',
	api_key: ''
}
...
```

Once you've updated your `Custom Fields Script URL` you'll need to refresh the Content Manager for the change to take effect.

## Set up Content Models to use Cloudinary Fields
In order to use Cloudinary fields, you need to have Content Models in Agility CMS that utilize these new field types and create some sample content.

1. Add Cloudinary fields to any **Content Model** in Agility CMS
	- Navigate to **Models -> Content Models -> {Your Content Model}**
	- Click **Add Field**
		- Field Name: `Cloudinary Image`
		- Field Type: `Custom Field`
		- Custom Field Type: `Cloudinary Image`
		- Click the *Add Field* button
	- Click **Add Field**
		- Field Name: `Cloudinary Video`
		- Field Type: `Custom Field`
		- Custom Field Type: `Cloudinary Video`
		- Click the *Add Field* button
	- Click **Save**
2. Create some content using your modified **Content Model**
	- Navigate to an instance of your content that is based on your **Content Model**
	- Click **+ New**
	- Fill out the fields
        - On the `Cloudinary Image` field click **Choose**
            - You should see your Cloudinary Media library.  You can upload or choose an existing image.
        - On the `Cloudinary Video` field, click  **Choose**
            - You can upload or choose an existing video.

## Output the Cloudinary Assets in your Solution
Now that you've set up the field and allow editors to reference assets from Cloudinary, the next thing you'll need to do is actually output these fields in your digital solution (i.e. website or app).

The value for an Image or Video Cloudinary field will be a `JSON` string returned from the API. 

### Parsing Values
In order to properly read your Cloudinary objects, you'll need to parse the string to an object.

In `JavaScript`, this can be accomplished using `JSON.parse(cloudinaryImageFieldValue)`.

### Using Cloudinary Libraries
Cloudinary builds and maintains front-end SDKs to assist with rendering images and videos, complete with handling transformations and much more.

- [Cloudinary JavaScript SDK](https://cloudinary.com/documentation/javascript2_quick_start)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react2_quick_start)
- [Cloudinary Vue.js SDK](https://cloudinary.com/documentation/vue_integration)
- [Cloudinary jQuery SDK](https://cloudinary.com/documentation/jquery_integration)
- [Cloudinary Mobile/Native SDKs](https://cloudinary.com/documentation/mobile_sdks)
- [Gatsby SDK](https://www.gatsbyjs.com/docs/how-to/images-and-media/using-cloudinary-image-service/)
- [Gridsom SDK](https://gridsome-cloudinary.netlify.app/)
- [Laravel SDK](https://github.com/cloudinary-labs/cloudinary-laravel/)
- [Nuxt JS](https://cloudinary.nuxtjs.org/)

If you want to see how a fully-functional website can use Cloudinary and Agility CMS, check out our [Next.js Example](#example)

