from django.urls import path

from .views import HomePageView, CampPageView, LoginPageView

urlpatterns = [
    #path('', homePageView, name='home')
    path('', HomePageView.as_view(), name='index'),
    path('home', HomePageView.as_view(), name='home'),
    path('camp', CampPageView.as_view(), name='camp'),
    path('login', LoginPageView.as_view(), name='login')
]
