from django.test import TestCase, Client
from dublin_bus.functions import load_model


class ViewTest(TestCase):
    def test_index_view(self):
        client = Client()
        resp = client.get('/test').content
        self.assertEqual(resp, b"<h3>Hi, we're team 8.</h3>")


class LoadModel(TestCase):
    """Test cases for the load_model function."""
    
    def test_load_model_success(self):
        """Test to ensure that a model is loaded correctly."""
        try:
            model = load_model("15A")
        except Exception as e:
            self.fail("load_model() raised an exception unexpectedly!\n Error is:" + e)

    def test_load_model_invalid_route(self):
        """Test to ensure that an error is raised if an invalid route is entered."""
        with self.assertRaises(Exception):
            load_model("15K")