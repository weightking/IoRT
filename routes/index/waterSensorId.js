module.exports = (req, res, next)=>{
    res.render('indexWaterSensor', { title: 'Water sensors-'+req.params.id });
}