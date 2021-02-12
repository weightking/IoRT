var express = require('express');
var router = express.Router();
let mongodb = require('../bin/mongodb');
let tcpServer = require('../bin/tcp-server.js');
const moment = require('moment')

// 显示某设备数据
router.get('/robotsId/:id', function(req, res, next) {
  res.render('robotOperation',{ title: 'Robot Operation System',tcpServer:tcpServer});
});

router.get('/temperatureId/:id', function(req, res, next) {
  res.render('indexTemperature', { title: 'Temperature and Humidity-'+req.params.id });
});

router.get('/gasQualityId/:id', function(req, res, next) {
  res.render('indexGasQuality', { title: 'Gas quality-'+req.params.id });
});

router.get('/waterSensorId/:id', function(req, res, next) {
  res.render('indexWaterSensor', { title: 'Water sensors-'+req.params.id });
});

// 获取某设备的历史数据
// GET /history/123456 取得设备id为12356的数据。
router.get('/history/:id', function(req, res, next) {
  mongodb.find({id:req.params.id},(err,docs)=>{
    if(err){
      res.send([])
      console.log(err)
    }
    else{
      let result = []
      docs.forEach( (doc) => {
        result.push({
          time:moment(doc.createdAt).format('mm:ss'),
          value:doc.data
        })
      });
      result.reverse()
      res.send(result)
    }
  })
});

// send commend to IoT equipment or robot
router.post('/device/:id',function (req,res,next) {
  console.log('post /led/:id - ',req.params.id,req.body);
  tcpServer.sentCommand(req.params.id,req.body.action)
  res.send({code:0,msg:'命令已发送'})
})

module.exports = router;
