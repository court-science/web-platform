from django.db import models
from django.contrib.postgres.fields import JSONField
# Create your models here.

class Camp(models.Model):
    """Model representing a Camp"""
    name = models.CharField(max_length=100, help_text='Enter a name for your camp')
    
    def __str__(self):
        """String for representing the Model object."""
        return self.name


class Room(models.Model):
    """Model representing a room genre."""
    name = models.CharField(max_length=100, help_text='Enter a room name')

    # Foreign Key used because room can only have one camp, but camps can have multiple rooms
    camp = models.ForeignKey('Camp', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        """String for representing the Model object."""
        return self.name


class Workitem(models.Model):
    """Model representing a room genre."""
    title = models.CharField(max_length=100, help_text='Enter a title')

    # Foreign Key used because room can only have one camp, but camps can have multiple rooms
    camp = models.ForeignKey('Camp', on_delete=models.SET_NULL, null=True)

    # Foreign Key used because room can only have one camp, but camps can have multiple rooms
    room = models.ForeignKey('Room', on_delete=models.SET_NULL, null=True)

    data = JSONField()
    # Add participant FK once particpants are implemented
    # # Foreign Key used because room can only have one camp, but camps can have multiple rooms
    # camp = models.ForeignKey('camp', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        """String for representing the Model object."""
        return self.title