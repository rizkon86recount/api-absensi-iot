import cv2
import sys
import os

# Argumen dari Node.js
image_path = sys.argv[1]

# Folder model dan cascade
MODEL_PATH = 'assets/trainer.yml'

# MODEL_PATH = os.path.join("assets", "trainer.yml")
CASCADE_PATH = 'services/haarcascade_frontalface_default.xml'

# Load recognizer dan cascade
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(MODEL_PATH)
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

# Load gambar
img = cv2.imread(image_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)

if len(faces) == 0:
    print('unknown')
    sys.exit()

# Ambil wajah pertama yang terdeteksi
for (x, y, w, h) in faces:
    id_, confidence = recognizer.predict(gray[y:y+h, x:x+w])

    # Cek ambang batas confidence
    if confidence < 80:
        print(f"user_{id_}")  # contoh faceId: user_1, user_2
    else:
        print('unknown')
    break
