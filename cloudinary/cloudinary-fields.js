/**
 * THIS FILE IS USED FOR THE AGILITY'S CUSTOM FIELDS
 */

var baseUrl = "https://agility.github.io/CustomFields/"

// Set your cloudinary settings here so your custom field can communicate with cloudinary
var cloudinarySettings = {
	cloud_name: '',
	api_key: ''
}

var integrationSettings = {
	type: 'agility_cloudinary_custom_field',
	platform: 'agilitycms',
	version: '1.0',
	environment: 'prod'
}

if(!cloudinarySettings.cloud_name || !cloudinarySettings.api_key) {
	console.error('Cloudinary `cloud_name` and `api_key` must be set in your Custom field script.')
}

var CloudinaryVideoField = function () {
	var field = this;
	field.Label = "Cloudinary Video";
	field.ReferenceName = "CloudinaryVideo";
	field.Render = function (options) {
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
							multiple: false,
							max_files: 1,
							search: { expression: 'resource_type:video' },
							type: integrationSettings.type,
							platform: integrationSettings.platform,
							version: integrationSettings.version,
							environment: integrationSettings.environment
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
							multiple: false,
							max_files: 1,
							asset: { resource_type: "video", type: "upload", public_id: self.fieldBinding().public_id() },
							type: integrationSettings.type,
							platform: integrationSettings.platform,
							version: integrationSettings.version,
							environment: integrationSettings.environment
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
							multiple: false,
							max_files: 1,
							search: { expression: 'resource_type:image' },
							type: integrationSettings.type,
							platform: integrationSettings.platform,
							version: integrationSettings.version,
							environment: integrationSettings.environment
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
							multiple: false,
							max_files: 1,
							asset: { resource_type: "image", type: "upload", public_id: self.fieldBinding().public_id() },,
							type: integrationSettings.type,
							platform: integrationSettings.platform,
							version: integrationSettings.version,
							environment: integrationSettings.environment
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
							return "https://res.cloudinary.com/" + cloudinarySettings.cloud_name + "/image/upload/c_scale,f_auto,w_500/" + self.fieldBinding().public_id() + ".jpg";
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