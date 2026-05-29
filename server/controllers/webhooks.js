import {Webhook} from 'svix';
import User from "../models/User.js";

//api controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        //create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //verifying headers
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers['svix-id'],
            "svix-timestamp":req.headers['svix-timestamp'],
            "svix-signature":req.headers['svix-signature']
        })
        //getting data from request body
        const {data,type} = req.body;

        switch (type) {
            case 'user.creates':{
                const userData={
                    _id:data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image:data.image_url,
                    resume:''
                }
                //save the user data to the database
                await User.create(userData);
                res.json({})
                break;
            }
            case 'user.updated':{
                //find the user in database and update the details
                const userData={
                    _id:data.id,
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image:data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData);
                res.json({})
                break;
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }
        }

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ success : false, message: 'Invalid webhook'  });
    }
}