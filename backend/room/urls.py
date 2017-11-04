from django.conf.urls import url
from room import views
from .models import Room


urlpatterns = [
    url('rooms', views.room_list, name='room_list'),
    url('rooms/(?P<room_id>[0-9]+)$', views.room_detail, name='room_detail'),
    url('rooms/(?P<room_id>[0-9]+)/users$', views.room_users, name='room_users'),

]
