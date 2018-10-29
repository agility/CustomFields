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
