from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView


class HomePageView(TemplateView):
    template_name = 'index.html'


def homePageView(request):
    return HttpResponse('Hello, World!')
