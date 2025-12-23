from django.contrib import admin
from .models import Profile, DiamondsBundle, GamesDesc, Likes, PendingUser

# Register your models here.
admin.site.register(Profile)
admin.site.register(DiamondsBundle) 
admin.site.register(GamesDesc) 
admin.site.register(Likes)
admin.site.register(PendingUser)