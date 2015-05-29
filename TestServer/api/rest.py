from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt 
import json, sys, os, time, datetime
from sys import path
from os  import path
from metadata import version
from django.shortcuts import redirect
import inspect

#without this we cannot access the packages inside this application
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def base(request):
    return redirect("kpi")

@csrf_exempt #this decorator is required to allow other than GET method ...
def index(request, versionName, pNoun, sNoun, param):
    print "rest py is called"
    try :
        #removing the trailing slash if present
        param = param.strip("/")
        resp = getattr(getattr(__import__(versionName+'.'+pNoun), pNoun), sNoun)(request,param)
        httpresp = HttpResponse(resp['data'], content_type='application/json') 
#         httpresp = HttpResponse(resp['data'])
#         httpresp.mimetype='application/json'
        httpresp.status_code = resp['code']
        httpresp[version.HEADER] = version.MINOR
        return httpresp
    except Exception, e:
        frm = inspect.trace()[-1]
        mod = inspect.getmodule(frm[0])
        modname = mod.__name__ if mod else frm[1]
        print 'Thrown from', modname
        print >>sys.stderr, e
        resp = HttpResponse(e) 
        resp.status_code = 501
        resp[version.HEADER] = version.MINOR
        return resp
