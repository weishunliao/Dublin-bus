#!/bin/bash

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn teeeeest.wsgi:application \
    --bind 0.0.0.0:8888 \
    --workers 3