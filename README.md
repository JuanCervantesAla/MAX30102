###Max30102 - ESP32 - ACCESS POINT - Arduino IDE - REACT LIVE SERVER

#Wire connections
1-Esp32-MAX30102 diagram (In this case i attached the SDA-Max30102 to the pin 18 and SCL to the 19G pin in ESP32 Board, but you can change this on the following code)

Make sure all the wires are connected to both board and sensor
![image](https://github.com/user-attachments/assets/0e17a234-fc5c-48ae-aade-0e26ea851b90)
![image](https://github.com/user-attachments/assets/6a83003e-bfc0-484d-8ed6-cdbcd7893ef6)


2-Connect your esp32 to your computer via usb cable
3-Make sure your esp32 is detected on device manager, usually its the C20PX driver(Note that you'll need to update drivers if there a warning icon)
![image](https://github.com/user-attachments/assets/5845e013-f53b-405c-82da-6bc96020b26a)

4-Make sure at this point to have esp32 flashed with the newest official firmware


#Code and configuration
1-Open the .ino file on your arduino and select your board and the correct port, otherwise it wont work
![image](https://github.com/user-attachments/assets/49d70a95-b191-4abe-af64-60b7b8cb398e)

2-Add the necesary libraries displayed on the following image in order to run the code
![image](https://github.com/user-attachments/assets/5b4fa07d-7b4c-404f-9372-6234225ee52b)

3-The upload your program to the esp32 by hitting the button upload

4-Once its compiled and running click on the serial monitor and adjust the baud rate the if the sensor its correctly connected it will display a lecture 
of (No finger if your finger is not on the sensor, or a bpm lecture if your finger its on the sensor)
![image](https://github.com/user-attachments/assets/05dd4be5-9f0e-4d73-b825-a984b19f6d9c)

5-At the same time, it would be displayed the acces point, just connect your device to the new network, accessible by phone or pc in the same network as the esp32
![image](https://github.com/user-attachments/assets/536d3bef-2551-42e3-9d00-216dbf53d8ed)

6-There a precharged html+ajax just to verify the sensor its working on live time
![image](https://github.com/user-attachments/assets/f897743c-678b-4798-bca4-3155eb401a1c)

#FRONT END
1-For the front end just download the folder and navigate till the project
2- <npm install> to install all necessary modules
3- <npm run dev> to run the react server
4-If everything its ok youre more likely to see the displayed lectures (Make sure youre connected to the Access point esp32 network)
![image](https://github.com/user-attachments/assets/9d0a6a4c-1d53-428b-a188-6643cafde4f8)
