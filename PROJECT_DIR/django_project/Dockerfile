# FROM directive instructing base image to build upon
#FROM python:3.6
#RUN mkdir -p /usr/src/app
#WORKDIR /usr/src/app
#ONBUILD COPY requirements.txt /usr/src/app/
#ONBUILD RUN pip install --no-cache-dir -r requirements.txt
#ONBUILD COPY . /usr/src/app

FROM python:3-onbuild

# COPY startup script into known file location in container
COPY start.sh /start.sh

# EXPOSE port 8000 to allow communication to/from server
EXPOSE 8000

# CMD specifcies the command to execute to start the server running.
CMD ["/start.sh"]
# done!