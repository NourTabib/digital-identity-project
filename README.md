# digital-identity-project
The server for this project has been constructed using Node.js, with Python scripts utilized for OCR and RSA encryption. The server receives image requests from the associated application, which include images of national identity cards for OCR and a selfie for facial recognition verification. The OCR process utilizes Python-based tools to extract relevant data from the national identity card images, which is then RSA encrypted for additional security before being returned to the application in encrypted form.  
  


  
The server has been designed with robust security measures to ensure the privacy and security of the sensitive information being processed. The images are treated with the utmost care, and the server only stores an eigen face of the selfie for later authentication and a hash of the extracted text to verify integrity. Additionally, the server employs facial recognition technology to verify the identity of the individual submitting the images.  
  
The server incorporates additional security measures such as the encryption of data both at rest and in transit. These measures ensure that the information is protected at all times, while still providing the necessary functionality to support the use case at hand.  
This is just a prototype,there is a lot to improve.  

I should note that the application was developed as part of my own learning journey with these technologies. While working on this project, I made many mistakes and faced a number of challenges that ultimately led to a better understanding of how to build secure and efficient systems. For example, I initially failed to design the solution thoroughly before beginning development, which led to significant rework later on.I also didn't centralise the configuration params in a single file which made it hard to make small changes.  
  
#### Improvements to be made 
1. In the registration process, it's better to Stream a video to the server instead of a single picture, so we can do OCR on a bunch of data and then juste taking the text that has higher frequency (eleminate faulty and corrupted Text) 
2. Implementing a server-side multi layer security policy, such as :      1.checking IPs.  
   2.the authenticity of the documents.  
   3.deep fake detection.  
4. Adding security measures in the mobile client, such as :  
   1. proof of life. 
   2. Adding undetectable watermarks in the document pictures to verify forged pictures. 
   3. Blocking the app usage on rooted devices. 
   4. Verifying the critical parts  source code checksum to detect altered fonctionalities(preventing hackers from altering the code logic for malicious intentions) . 
   5. Implementing a measures to make the locally saved identity token useless without getting permissions from the server.  
   6. Implementing an image quality checker and preprocessor to reduce the workload done on the server (Android OpenCV). 

In the upcoming development phase, my plan is to create a production-ready solution that meets the necessary standards and requirements.  
