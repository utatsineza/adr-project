# Assignment Deadline Reminder

A Django-based application to help students track and get reminders for assignment deadlines.

## Project Structure

assignment_tracker/
├── backend/ # App(s) or backend logic
├── deadline_reminder/ # Django project config 
├── venv/ # Virtual environment 
├── db.sqlite3 # SQLite database file 
├── manage.py # Django management script
├── requirements.txt # Python dependencies


---

Follow these steps to set up and run the project locally.

### Clone the repository
```bash
git clone <your-repository-url>
cd assignment_tracker

# Create venv (if not already existing)
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

#apply migrations
pip install -r requirements.txt
python manage.py migrate

#run the development server
python manage.py runserver
and open http://127.0.0.1:8000/dashboard-page



