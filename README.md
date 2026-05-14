# Competitive Success Academy – Refined School Website

This is a modern, mobile-friendly website for **Competitive Success Academy**, built with HTML, CSS, JavaScript (frontend), and Python Flask (backend).  
The backend handles form submissions (e.g. Admission Form) and forwards data to email.

---

## 📁 Folder Structure

competitive-success-academy/
├── app.py # Flask backend server
├── requirements.txt # Python dependencies
├── static/ # CSS & JS
│ ├── styles.css
│ └── script.js
├── templates/ # HTML pages
│ ├── index.html
│ ├── admission.html
│ └── album.html
│ └── thankyou.html

  

---

## 🚀 How to Run Locally

### 1. Install Python (3.9+)
[Download Python](https://www.python.org/downloads/)

### 2. Install Dependencies
```bash
pip install -r requirements.txt


Run the flask server 
python app.py


Then visit http://127.0.0.1:5000

please change it to functional school email
receiver_email = "school@example.com"

app.config['MAIL_USERNAME'] = 'sender email'
app.config['MAIL_PASSWORD'] = 'password from app' { google apps password }
app.config['MAIL_DEFAULT_SENDER'] = 'sender mail again'

.

👨‍💻 Author
Refined and developed by Russel Khomdram
GitHub: github.com/russelkh/School-website



