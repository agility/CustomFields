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

    const uploadRes = await api.uploadMedia({
        fileName: 'test.jpg',
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

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;