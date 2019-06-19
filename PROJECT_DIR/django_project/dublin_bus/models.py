from django.db import models


class Stop(models.Model):
    stop_id = models.IntegerField(primary_key=True)
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()
    stop_name = models.CharField(max_length=255)

    class Meta:
        db_table = "stops"
