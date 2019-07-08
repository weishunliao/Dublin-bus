from django.http import HttpResponse, HttpResponseRedirect

# def home(request):
#     print(request)
#     return HttpResponse("<h1>Hello World</h1>")



def home(request):
    response = HttpResponse()
    response.write("<p>Here's the webpage</p>")
    print(request.user)

    return response

def redirectSomewhere(request):
    return HttpResponseRedirect("/somepath")