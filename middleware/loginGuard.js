const guard = (req,res,next)=>{
    if (req.url!='/login' && !req.session.username){
        res.redirect('/login')
    }else {
        next()
    }
}

module.exports = guard