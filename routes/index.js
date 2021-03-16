var express = require('express');
var router = express.Router();
//let mongodb = require('../bin/mongodb');
const moment = require('moment')

router.get('/login',require('./index/loginget'))

router.post('/login',require('./index/loginpost'))

router.get('/operation',require('./index/operation'))

router.get('/logout', require('./index/logout'))

// 显示某设备数据
router.get('/robotsId/:id', require('./index/robotsId'));

router.get('/temperatureId/:id', require('./index/temperatureId'));

router.get('/gasQualityId/:id', require('./index/gasQualityId'));

router.get('/waterSensorId/:id', require('./index/waterSensorId'));

// 获取某设备的历史数据
// GET /history/123456 取得设备id为12356的数据。
// router.get('/history/:id', function(req, res, next) {
//   mongodb.find({id:req.params.id},(err,docs)=>{
//     if(err){
//       res.send([])
//       console.log(err)
//     }
//     else{
//       let result = []
//       docs.forEach( (doc) => {
//         result.push({
//           time:moment(doc.createdAt).format('mm:ss'),
//           value:doc.data
//         })
//       });
//       result.reverse()
//       res.send(result)
//     }
//   })
// });

// send commend to IoT equipment or robot
router.post('/device/:id',require('./index/deviceIdpost'))

module.exports = router;
