import jwt from "jsonwebtoken";
const JWT_SECRET = "hello12345"

export const checkToken = async (req, res, next)=>{
  try {
    let token = req.headers.authorization;
    if(!token){
        return res.json({msg: "provide a token", success:false})
    }

    let decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded;
    next();

  } catch (error) {
    return res.json({msg: "token is not valid", success:false,error:error.message})
  }
}