import os
import pickle
from django.conf import settings

def load_model(route):
    """Loads and returns a machine learning model for the specified bus route."""
    if route == '15A':
        model_name = '15A_model.sav'
    else:
        raise Exception(route + " is not a valid bus route!")
    path = os.path.join(settings.MODEL_ROOT, model_name)
    with open(path, 'rb') as file:
        model = pickle.load(file)
    return model