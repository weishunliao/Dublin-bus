from django.test import TestCase, Client


class ViewTest(TestCase):
    def test_index_view(self):
        client = Client()
        resp = client.get('/test').content
        self.assertEqual(resp, b"<h3>Hi, we're team 8.</h3>")
