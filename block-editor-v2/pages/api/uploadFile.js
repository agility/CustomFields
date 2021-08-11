// export default function handler(req, res) {
//     console.log(req.body)
//     res.status(200).json(
//         { 
//             success: 1,
//             file: {
//                 url: 'https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg'
//             }
//         }
//     )
// }

import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect';
import agilityMgmt from '@agility/content-management'
import fs from 'fs'


const handler = nextConnect();

handler.use(middleware);

handler.post(async(req, res) => {
    
    const api = agilityMgmt.getApi({
        location: req.body.location,
        websiteName: req.body.websiteName,
        securityKey: req.body.securityKey
    });
    
    console.log(req.files.image[0]);
    
    let blob = fs.createReadStream(req.files.image[0].path)
    console.log(req.files.image[0]);
    const uploadRes = await api.uploadMedia({
        fileName: `${makeid(5)}-${req.files.image[0].originalFileName}`,
        fileContent: blob
    })

    console.log(uploadRes);

    // do stuff with files and body
    res.status(200).json({ 
        success: 1,
        file: {
            url: uploadRes.url
        }
    });

});

const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;