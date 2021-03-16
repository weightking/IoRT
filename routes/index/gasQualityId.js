module.exports = (req, res, next)=>{
    res.render('indexGasQuality', { title: 'Gas quality-'+req.params.id });
}