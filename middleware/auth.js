////resposibility of middleware is to check user authentication
/// it means if a user try to perform an action then check
// that that user has permission of doing that or not
///if user has permision then middleware allow to do that action i.e next


import jwt from 'jsonwebtoken';

const auth = async (req,res,next) => {
    try {
        ///get token of user from fronted
        // console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];

        //checking token is from google or our custom
        const isCustomAuth = token.length <500;
        // console.log(isCustomAuth);
        let decodeData;

        if(token && isCustomAuth){
            
            //veryfy token to check is user is login or not
            decodeData = jwt.verify(token,'test');
            // console.log(decodeData?.id)
            // console.log(req.userId);
            //this req.userId can be used to check futher if user is authenticated or not
            req.UserId = decodeData?.id;

        }
        else{
            //if token is from google
            decodeData = jwt.verify(token,'test');
            req.userId = decodeData?.sub;
        }
        //if user is login then allow to perform action
        next();

    } catch (error) {
        console.log(error);
    }

}

export default auth;

///best place to use middleware is in route