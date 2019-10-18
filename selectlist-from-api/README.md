# Selectlist from API Field
This custom field for Agility CMS is a boilerplate sample for how to search and select data from external third-party APIs. This is very useful creating integrations between content in Agility CMS and external content.

## Installation Instructions
   
1. Open the HTML file `/html/selectlist-from-api-template.html` and proceed to Media & Documents and upload the HTML file, or create an Inline Code file containing the contents of the file.
 
2. Open the JS file `/js/select-from-api-init.js` and replace the values referencing dependency sources.
	 - Replace the values for Template to the absolute URL of the `selectlist-from-api-template.html` or the inline code reference name.
 
3. Copy the entire contents of the `select-from-api-init.js` file and paste into your existing Input Form Customization JS file. 
If you don't have one already, save the contents of the file into a new JS file and upload this to Media & Documents, record the absolute URL and set the value in the CMS under Settings > Development Framework > Input Form Customization. Alternatively, you may also save this as an Inline Code file and reference it as your Input Form Customization.

4. If done successfully, you should see your custom field type available as an option within Module/Content definitions form builder.

5. Now, customize the JS to work with your external API.

## Stuck?
Please contact support@agilitycms.com and we can assist or join our [slack channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI).
