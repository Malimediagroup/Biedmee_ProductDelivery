# -*- coding: utf-8 -*-
from pyramid.config import Configurator
from pyramid.request import Request
from pyramid.request import Response

# TODO: remove in production
def request_factory(environ):
    request = Request(environ)
    if request.is_xhr:
        request.response = Response()
        request.response.headerlist = []
        request.response.headerlist.extend(
            (
                ('Access-Control-Allow-Origin', '*'),
                ('Content-Type', 'application/json')
            )
        )
    return request

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    # TODO: remove in production
    #~ config.set_request_factory(request_factory)
    config.include('pyramid_chameleon')
    config.add_route('home', '/')
    #~ config.add_static_view('/', './index.html')
    config.add_route('echo', '/echo')
    config.add_route('create', '/create')
    config.scan()
    return config.make_wsgi_app()
