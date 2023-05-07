# digital-identity-project
The server for this project has been constructed using Node.js, with Python scripts utilized for OCR and RSA encryption. The server receives image requests from the associated application, which include images of national identity cards for OCR and a selfie for facial recognition verification. The OCR process utilizes Python-based tools to extract relevant data from the national identity card images, which is then RSA encrypted for additional security before being returned to the application in encrypted form.  
  
The server has been designed with robust security measures to ensure the privacy and security of the sensitive information being processed. The images are treated with the utmost care, and the server only stores an eigen face of the selfie for later authentication and a hash of the extracted text to verify integrity. Additionally, the server employs facial recognition technology to verify the identity of the individual submitting the images.  
  
Finally, the server incorporates additional security measures such as the encryption of data both at rest and in transit. These measures ensure that the information is protected at all times, while still providing the necessary functionality to support the use case at hand.  
This is just a prototype,there is a lot to improve.  
  
In the upcoming development phase, my plan is to create a production-ready solution that meets the necessary standards and requirements.  
