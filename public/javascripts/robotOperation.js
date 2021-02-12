// get current host to support url to construct websocket
const host = window.location.host
// get id from current web address
let equipmentId = window.location.pathname.split("/")[2] || "123456"
let equipmentRosTopic = equipmentId+"RosTopic"

// construct websocket connection
const socket = new WebSocket('ws://'+host);
const socket1 = new WebSocket('ws://'+host);

// construct websocket connection
socket.onopen=function () {
    console.log("websocket connect!")
    let data1 = JSON.stringify({equipmentId:equipmentRosTopic})
    //send Id to websocket server to arrange corresponding socket
    socket.send(data1)
}

socket1.onopen=function () {
    console.log("websocket connect!")
    let data1 = JSON.stringify({equipmentId:equipmentId})
    //send Id to websocket server to arrange corresponding socket
    socket1.send(data1)
}

function init() {
    let viewer = new ROS2D.Viewer({
        divID: 'nav',
        width: 400,
        height: 400
    });
    let gridClient = new OccupancyGridClient({
        rootObject : viewer.scene,
        viewer: viewer
    });
    let navigation = new Navigator({
        rootObject: viewer.scene,
        viewer: viewer
    });
}

socket.onclose=function () {
    console.log("websocket close.")
}

socket.onerror=function () {
    console.log("websocket error:",event)
}

//post request for robot movement
$('#Park-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'P'})})
})
$('#NormalMoveForward-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'+'})})
})
$('#AccMoveForward-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'++'})})
})
$('#NormalMoveBack-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'-'})})
})
$('#AccMoveBack-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'--'})})
})
$('#NormalTurnRight-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'>'})})
})
$('#AccTurnRight-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'>>'})})
})
$('#NormalTurnLeft-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'<'})})
})
$('#AccTurnLeft-Robot').click(function () {
    $.post('/device/'+equipmentId,{action:JSON.stringify({label:'<<'})})
})
// function define to update the map
function OccupancyGridClient(options) {
    let that = this;
    options = options || {};
    this.viewer = options.viewer;
    this.continuous = options.continuous;
    this.rootObject = options.rootObject || new createjs.Container();

    // current grid that is displayed
    // create an empty shape to start with, so that the order remains correct.
    this.currentGrid = new createjs.Shape();
    this.rootObject.addChild(this.currentGrid);
    // work-around for a bug in easeljs -- needs a second object to render correctly
    this.rootObject.addChild(new ROS2D.Grid({size: 1}));
    socket.onmessage=function (msg) {
        // check for an old map
        let index = null;
        if (that.currentGrid) {
            index = that.rootObject.getChildIndex(that.currentGrid);
            that.rootObject.removeChild(that.currentGrid);
        }
        that.currentGrid = new ROS2D.OccupancyGrid({
            message: JSON.parse(msg.data)
        });
        if (index !== null) {
            that.rootObject.addChildAt(that.currentGrid, index);
        } else {
            that.rootObject.addChild(that.currentGrid);
        }
        that.viewer.scaleToDimensions(that.currentGrid.width, that.currentGrid.height);
        that.viewer.shift(that.currentGrid.pose.position.x, that.currentGrid.pose.position.y);
    }
};
// function define to update the robot position
function Navigator(options) {
    let that = this;
    options = options || {};
    this.viewer = options.viewer;
    this.rootObject = options.rootObject || new createjs.Container();
    let withOrientation = false;
    this.goalMarker = null;
    const currentPose = new Array()
    currentPose[0]={"position":{"x":10000,"y":10000,"z":0},"orientation":{"x":0,"y":0,"z":0,"w":10000}}

    function sendGoal(pose) {
        $.post('/device/'+equipmentId,{action:JSON.stringify({goal:pose,label:'goal'})})
        //create a marker for the goal
        if (that.goalMarker === null) {
            that.goalMarker = new ROS2D.NavigationArrow({
                size: 15,
                strokeSize: 1,
                fillColor: createjs.Graphics.getRGB(255, 64, 128, 0.66),
                pulse: true
            });
            that.rootObject.addChild(that.goalMarker);
        }
        that.goalMarker.x = pose.position.x;
        that.goalMarker.y = -pose.position.y;
        that.goalMarker.rotation = stage.rosQuaternionToGlobalTheta(pose.orientation);
        that.goalMarker.scaleX = 1.0 / stage.scaleX;
        that.goalMarker.scaleY = 1.0 / stage.scaleY;
    }

    this.cancelGoal = function () {
        if (typeof that.currentGoal !== 'undefined') {
            that.currentGoal.cancel();
        }
    };
    // get a handle to the stage
    let stage;
    if (that.rootObject instanceof createjs.Stage) {
        stage = that.rootObject;
    } else {
        stage = that.rootObject.getStage();
    }
    // marker for the robot
    let robotMarker = null;

    robotMarker = new ROS2D.NavigationArrow({
        size: 25,
        strokeSize: 1,
        fillColor: createjs.Graphics.getRGB(255, 128, 0, 0.66),
        pulse: true
    });
    // wait for a pose to come in first
    robotMarker.visible = false;
    this.rootObject.addChild(robotMarker);
    let initScaleSet = false;

    let updateRobotPosition = function(pose, orientation) {
        // update the robots position on the map
        robotMarker.x = pose.x;
        robotMarker.y = -pose.y;
        if (!initScaleSet) {
            robotMarker.scaleX = 1.0 / stage.scaleX;
            robotMarker.scaleY = 1.0 / stage.scaleY;
            initScaleSet = true;
        }
        // change the angle
        robotMarker.rotation = stage.rosQuaternionToGlobalTheta(orientation);
        // Set visible
        robotMarker.visible = true;
    };
    socket1.onmessage=function (msg) {
        let pose = JSON.parse(msg.data)
        updateRobotPosition(pose.position, pose.orientation);
        // judge the location of robot is same with the goal, remove the goal marker if merge
        if (Math.abs(currentPose[0].position.x-pose.position.x)<0.18
            &&Math.abs(currentPose[0].position.y-pose.position.y)<0.05
            &&Math.abs(currentPose[0].orientation.w-pose.orientation.w)<0.0015)
        {
            that.rootObject.removeChild(that.goalMarker);
        }
    };
    if (withOrientation === false){
        // setup a double click listener (no orientation)
        this.rootObject.addEventListener('dblclick', function(event) {
            // convert to ROS coordinates
            let coords = stage.globalToRos(event.stageX, event.stageY);
            let pose = new ROSLIB.Pose({
                position : new ROSLIB.Vector3(coords)
            });
            sendGoal(pose);
            currentPose[0]=pose;
        });
    }
}

