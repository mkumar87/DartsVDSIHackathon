from django.db import models

# Create your models here.

class Train(models.Model):  
    phrase = models.CharField(max_length = 100)  
    polarity = models.CharField(max_length = 4)   
