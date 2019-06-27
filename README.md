[![Build Status](https://travis-ci.org/the-8-team/COMP47360.svg?branch=raph_dev)](https://travis-ci.org/the-8-team/COMP47360)

[![Coverage Status](https://coveralls.io/repos/github/the-8-team/COMP47360/badge.svg?branch=feature/js_test)](https://coveralls.io/github/the-8-team/COMP47360?branch=feature/js_test)
# COMP47360

- dev_environment = the virtual environment for development; activate with 'source dev_environment/bin/activate'
- PROJECT_DIR contains all the code


## Steps to build dev environment

1) In the root directory, activate with 'source dev_environment/bin/activate'
2) cd into PROJECT_DIR and run 'pip install -r requirements.txt' 
3) cd into django_project; run 'npm install' NB you must have Node installed already
4) Run 'npm run dev'

Then, to have live reloading, you need 3 terminals open, run these commands in this order. 

In the first terminal run 'npm run watch' (this is to get webpack watching)
In the second run 'python manage.py livereload'
In the third, run 'python manage.py runserver' 


## Steps to build **production**

1) in django_project, first run 'npm run build' to build the static files
2) then, run 'python manage.py collectstatic' to move the static files to PROJECT_DIR/
3) in PROJECT_DIR, run 'docker-compose build' 
4) Then, run 'docker-compose up' and nginx will serve the app!
