# Friendly URL
This custom field for Agility allows a friendly URL slug to be generated off the 'Title' field for an Agility Content Item or Module. 

![friendly-url-field-default](screenshots/friendly-url-field-default.png?raw=true "Friendly URL Field")
![friendly-url-field-change](screenshots/friendly-url-field-change.png?raw=true "Friendly URL Field - Edit")

## Installation Instructions
   
1. Open the HTML file /html/friendly-url-template.html and proceed to Media & Documents and upload the HTML file, or create an Inline Code file containing the contents of the file.
 
2. Open the JS file /js/friendly-url-init.js and replace the values referencing dependency sources.
	 - Replace the values for Template to the absolute URL of the friendly-url-template or the inline code reference name.
 
3. Copy the entire contents of the friendly-url-init.js file and paste into your existing Input Form Customization JS file. 
If you don't have one already, save the contents of the file into a new JS file and upload this to Media & Documents, record the absolute URL and set the value in the CMS under Settings > Development Framework > Input Form Customization. Alternatively, you may also save this as an Inline Code file and reference it as your Input Form Customization.

4. If done successfully, you should see your custom field type available as an option within Module/Content definitions form builder.
