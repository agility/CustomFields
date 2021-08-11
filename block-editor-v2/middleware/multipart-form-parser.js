//TODO: not used

// import  formidable  from  'formidable';

// const  form = formidable({ multiples:  false }); // multiples means req.files will be an array

// form.onPart = function(part) {
//     if (!part.filename) {
//         // let formidable handle all non-file parts
//         form.handlePart(part);
//         return;
//     }
// }

// export  default  async  function  parseMultipartForm(req, res, next) {
   
// 	const  contentType = req.headers['content-type']
// 	if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
// 		form.parse(req, (err, fields, files) => {
//             debugger;
//             if (!err) {
//                 req.body = fields; // sets the body field in the request object
//                 req.fileContent = files.content; // sets the files field in the request object
//             }
//             next(); // continues to the next middleware or to the route
// 		})
// 	} else {
// 		next();
// 	}
// }