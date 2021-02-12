// 导入net模块:
const net = require('net')
const PORT = "9004"
const equipmentArray1 = []
const mapData = new Array()
mapData[0]=""

//initial Tcp server
const server = net.createServer((socket) => {
    //connect
    let addr = socket.remoteAddress + ':' + socket.remotePort
    console.log(addr, " connected.")
    // receive data from Tcp client and arrange corresponding socket to the connected Tcp client.
    socket.on("data", data => {
        let dataArray = data.toString('ascii')
        socket.lastValue = dataArray
        // 接收的第一条数据为设备id
        if (!socket.id) {
            socket.id = data.toString('ascii')
            socket.addr = addr
            addEquipment(socket)
        } else {
            if (socket.id == "Robot1RosTopic") {
                //the reason to use push at here is to avoid the TCP data fragmentation
                mapData.push(dataArray)
            }
        }
    })
    // close
    socket.on('close', () => {
        console.log(addr, socket.id, "close")
        deleteEquipment(socket.id, socket.addr)
    })

    socket.on('error', () => {
        console.log(addr, socket.id, "error")
        deleteEquipment(socket.id, socket.addr)
    })
})

server.on("error", (err) => {
    console.log(err)
})

//开启监听
server.listen({port: PORT, host: '0.0.0.0'}, () => {
    console.log('demo2 tcp server running on', server.address())
//    setTimeout(() => {
//		tcpClient.init()
//    }, 4000);
})

// 给列表添加设备
function addEquipment(socket) {
    // 先从列表删除旧的同名连接
    deleteEquipment(socket.id, socket.addr)
    equipmentArray1.push(socket)

}

// 从列表中删除设备
function deleteEquipment(id, addr) {
    if (!id || !addr) {
        return;
    }

    let index = null
    let i
    // 从数组中找到它的位置
    for (i = 0; i < equipmentArray1.length; i++) {
        if (equipmentArray1[i].id === id && equipmentArray1[i].addr === addr) {
            index = i;
        }
    }
    // 从数组中删除该设备
    if (index != null) {
        equipmentArray1.splice(index, 1)
    }

}

// 在列表中找到某个id、addr的设备，结果为数组，可能包含多个socket。
function findEquipment(id, addr) {
    let result = []
    let i

    for (i = 0; i < equipmentArray1.length; i++) {
        if (equipmentArray1[i].id === id && equipmentArray1[i].addr === addr) {
            result.push(equipmentArray1[i])
        }
    }
    return result
}

// 在列表中找到某个id的设备，结果为数组，可能包含多个socket。
function findEquipmentById(id) {
    let result = []
    let i

    for (i = 0; i < equipmentArray1.length; i++) {
        if (equipmentArray1[i].id === id) {
            result.push(equipmentArray1[i])
        }
    }
    return result
}

module.exports = {
    mapData:mapData,
    equipmentArray1: equipmentArray1,
}