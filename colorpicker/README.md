# Color Picker
This custom field for Agility allows editors to 'pick' a color from the color wheel and save the value of the color as an RBGA or HEX value.

![Color Picker Open](screenshots/colorpicker-open.png?raw=true "Color Picker Open")
![Color Picker Open](screenshots/colorpicker-closed.png?raw=true "Color Picker Closed")

## Installation Instructions

1. Upload the assets located in /img/ to Media & Documents, and make note of the absolute URLs.
   
2. Open the HTML file /html/colorpicker-template.html and update the background images being referenced in the inline css, using the URLs you just uploaded. Then, proceed to Media & Documents and upload the HTML file, or create an Inline Code file containing the contents of the file.
 
3. Upload (to Media & Documents) or create an Inline Code file for /js/colorpicker-plugin.js and make note of the absolute URL or inline code reference name.
 

4. Open the JS file /js/colorpicker-init.js and replace the values referencing dependency sources.
	 - Replace the values for Template to the absolute URL of the colorpicker-template.html or the inline code reference name.
	 - Replace the values for DependenciesJS.src to the absolute URLs or inline code reference name for your /js/colorpicker-plugin.js
 
5. Copy the entire contents of the colorpicker-init.js file and paste into your existing Input Form Customization JS file. 
If you don't have one already, save the contents of the file into a new JS file and upload this to Media & Documents, record the absolute URL and set the value in the CMS under Settings > Development Framework > Input Form Customization. Alternatively, you may also save this as an Inline Code file and reference it as your Input Form Customization.

6. If done successfully, you should see your custom field type available as an option within Module/Content definitions form builder.

