FROM python:3
RUN mkdir /code/
COPY requirements.txt ./code
WORKDIR /code/
RUN pip install -r requirements.txt
COPY . /code/
EXPOSE 8000
CMD ["gunicorn", "--chdir", "django_project", "--bind", ":8000", "django_project.wsgi:application"]





