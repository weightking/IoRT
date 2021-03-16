// run the simulation robot
1. roslaunch robot_sim_demo robot_spawn.launch

// run the rosbridge sever to connect the robot with the tcp client
2. roslaunch rosbridge_server rosbridge_websocket.launch

// run the navigation algorithm
3. roslaunch navigation_sim_demo amcl_demo_launch

// publish the robot position
4. rosrun robot_pose_publisher robot_pose_publisher

// run keyboard teleop if you want to operate robot in local computer
5. rosrun robot_sim_demo robot_keyboard_teleop.py
