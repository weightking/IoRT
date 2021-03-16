module.exports = (req, res, next)=>{
    res.render('indexTemperature', { title: 'Temperature and Humidity-'+req.params.id });
}