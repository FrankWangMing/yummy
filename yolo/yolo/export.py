# from ultralytics import YOLO
#
#
#
# # Load the YOLO11 model
# model = YOLO("yolo11n.pt")
#
# # Export the model to TF.js format
# model.export(format="tfjs")  # creates '/yolo11n_web_model'
#
# # Load the exported TF.js model
# tfjs_model = YOLO("./yolo11n_web_model")
#
# # Run inference
# results = tfjs_model("https://ultralytics.com/images/bus.jpg")
from PIL import Image
from ultralytics import YOLO

# Load the YOLO11 model
model = YOLO("yolo11n-seg.pt")

model.export(format="saved_model",keras=True)

# im1 = "https://ultralytics.com/images/bus.jpg"
# accepts all formats - image/dir/Path/URL/video/PIL/ndarray. 0 for webcam
# results = model.predict(source=[im1], save=True, imgsz=320, conf=0.5)  # Display preds. Accepts all YOLO predict arguments
# Run inference on 'bus.jpg' with arguments
# from PIL


# # Export the model to TF.js format
# model.export(format="onnx")  # creates '/yolo11n_web_model'
#
# # Load the exported TF.js model
# tfjs_model = YOLO("./yolo11n_web_model")
#
# # Run inference
# results = tfjs_model("https://ultralytics.com/images/bus.jpg")