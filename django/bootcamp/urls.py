from django.urls import include, path
from django.contrib.auth import views as auth_views
from .views import HomePageView, CampPageView, LoginPageView, ZonePageView, SignupPageView

urlpatterns = [
    #path('', homePageView, name='home')
    path('', HomePageView.as_view(), name='index'),
    path('home', HomePageView.as_view(), name='home'),
    path('camp', CampPageView.as_view(), name='camp'),
    path('signup', SignupPageView.as_view(), name='signup'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('zone', ZonePageView.as_view(), name='zone'),
    # path('login', auth_views.login,  {'template_name': 'templates/login.html'}, name='login')
]