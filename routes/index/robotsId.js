let tcpServer = require('../../bin/tcp-server.js');
module.exports = (req,res)=>{
    res.render('robotOperation',{ title: 'Robot Operation System',tcpServer:tcpServer})
}