import sys
import face_recognition
import os
import json

face1 = face_recognition.load_image_file(str(sys.argv[1]))
face2 = face_recognition.load_image_file(str(sys.argv[2]))

face1_Embedding = face_recognition.face_encodings(face1)[0]
face2_Embedding = face_recognition.face_encodings(face2)[0]

result = face_recognition.compare_faces([face1_Embedding], face2_Embedding)

data = {
    "result" : True,
    "face_encodings" : face1_Embedding.tolist()
}
return_data = json.dumps(data)
print(return_data)

