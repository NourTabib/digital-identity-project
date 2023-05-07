import sys
import face_recognition
import os
import json
import numpy

arg2 = json.loads(sys.argv[1])


face1 = face_recognition.load_image_file(str(sys.argv[2]))

face1_Embedding = face_recognition.face_encodings(face1)[0]
face2_Embedding = numpy.array(arg2)



result = bool(face_recognition.compare_faces([face1_Embedding], face2_Embedding)[0])

data = {
    "result" : result,
}

return_data = json.dumps(data)
print(str(result))

