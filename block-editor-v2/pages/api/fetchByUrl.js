// export default function handler(req, res) {
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

const handler = nextConnect();

handler.use(middleware);

handler.post(async(req, res) => {
	try {
		const files = req.files
		const body = req.body
        console.log(body);
		// do stuff with files and body
		res.status(200).json({ 
            success: 1,
            file: {
                url: 'https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg'
            }
        });
	} catch (err) {
		res.status(500).json({error: err.message});
	}
});

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;