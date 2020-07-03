from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView


class HomePageView(TemplateView):
    template_name = 'index.html'

class CampPageView(TemplateView):
    template_name = 'camp.html'

class LoginPageView(TemplateView):
    template_name = 'login.html'