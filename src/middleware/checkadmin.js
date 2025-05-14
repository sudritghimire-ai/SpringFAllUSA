const isAdmin = (req,res,next) =>{

if(req.role !== "admin"){
    return res.status(403).send({
        success : false,
        message:"Authorized only for admins."
    })
}

next()


}

module.exports = isAdmin;
 