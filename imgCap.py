import cv2

# 1.creating a video object
rtsp_link = 'rtsp://192.168.1.101:8080/h264_pcm.sdp'
print("opening camera")
video = cv2.VideoCapture(rtsp_link)
print("camera opened")

check, frame = video.read()
if (check):
    cv2.imwrite("./images/parkingWithCar.jpg", frame)
    print('captured')
else:
    print("cant capture the frames")

video.release()
cv2.destroyAllWindows
