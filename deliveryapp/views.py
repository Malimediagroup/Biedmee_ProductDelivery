# -*- coding: utf-8 -*-
# logging
import logging
log = logging.getLogger(__name__)

from pyramid.view import (
    view_config,
    view_defaults
    )
from pyramid.renderers import render
import pystache
from zenpy import Zenpy
from zenpy.lib.api_objects import Ticket, Request, User
from zenpy.lib.exception import APIException

DeliveryRequestToken = os.environ['DELIVERY_REQUEST_TOKEN']
zendesk_creds = {
    'email' : os.environ['ZENDESK_LOGIN_EMAIL'],
    'token': DeliveryRequestToken,
    'subdomain' : 'biedmee',
}
zenpy = Zenpy(**zendesk_creds)

mustache_template = """# VEILINGEN

{{#auctions}}
*OGM*
    {{OGM}}
*Veiling titel*
    {{auctionName}}

{{/auctions}}

# OPMERKINGEN

{{extraInfo}}

# ADRESGEGEVENS

{{#user}}
*Email* :           {{emailAddress}}

*Bedrijf* :         {{company}}
*residenceType*:    {{residenceType}}
*Voornaam* :        {{firstName}}
*Familienaam* :     {{lastName}}
*Straat* :          {{street}}
*Huisnr* :          {{houseNumber}}
*Bus* :             {{houseNumberAdd}}
*Postcode* :        {{postalCode}}
*Gemeente* :        {{locality}}
*Land* :            {{country}}
{{/user}}
"""


@view_defaults(route_name ='home',
               xhr        = False,
               renderer   ='string',)
class DeliveryRequestViews(object):
    """ Non-important views for testing purposes
    """
    def __init__(self, request):
        self.request = request
        
    @view_config(request_method='GET')
    def home_get_view(self):
        log.debug('"GET": ok')
        return '"GET": ok'

    @view_config(request_method='POST')
    def home_post_view(self):
        log.debug('"POST": ok')
        return '"POST": ok'


@view_defaults(route_name='create', xhr=False, renderer='string')
class DeliveryRequestTest(object):
    """ Non-important views for testing purposes
    """
    def __init__(self, request):
        self.request = request
        
    @view_config(request_method='GET')
    def test_get_view(self):
        log.debug('"GET": ok')
        return '"GET": ok'

    @view_config(request_method='POST')
    def test_post_view(self):
        log.debug('"POST": ok')
        return '"POST": ok'


@view_defaults(route_name='create', xhr=True, renderer='json')
class DeliveryRequestXHR(object):
    """ Actual app-views:
        
    """
    def __init__(self, request):
        self.request = request
        log.debug("Request received: %s", type(request))
        self.json_body  = self.request.json_body
        self.req_email  = self.json_body['user']['emailAddress']
        self.req_name   = ' '.join([self.json_body['user']['firstName'],
                                    self.json_body['user']['lastName']])
        self.zenpy      = zenpy
        self.zen_user   = self._search_or_create_zen_user(self.req_email)
        
    @view_config(request_method='POST')
    def create_ticket(self):
        log.debug('"POST" XHR: OK')
        formatted = self.json_to_markdown(self.json_body)
        log.debug(formatted)
        t = Ticket(subject="Bestelling: {}".format(', '.join([auc['OGM'] for auc in self.json_body['auctions']])),
                   type='task',
                   requester=self.zen_user,
                   description=formatted + '\n############JSON############\n' + self.request.text)
        response = self.zenpy.tickets.create(t)
        serializable = {k: v for k, v in response.ticket.__dict__.items() if not k in ('_via', 'api')}
        return serializable

    def _search_or_create_zen_user(self, req_email):
        # Rerturns a zenpy.lib.generator.ResultGenerator object
        l = self.zenpy.search(req_email, type='user')
        if l:
            # Found user
            log.debug('Found user')
            return l.next()
        else:
            # Create the user
            log.debug('Creating user')
            return self._create_zen_user(req_email)

    def _create_zen_user(self, req_email):
        u = User(name=self.req_name, email=req_email,
                 role='end-user', locale_id=1005)
        return self.zenpy.users.create(u)

    def json_to_markdown(self, json_body):
        return pystache.render(mustache_template, json_body)


# More test views below
@view_config(route_name='echo',
             request_method='OPTIONS',
             xhr=True)
def echo_xhr_options_view(request):
    log.debug(request)
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
    })
    return response

@view_config(route_name='echo',
             request_method='GET',
             xhr=True,
             renderer='json')
def echo_xhr_get_view(request):
    log.debug(request.json_body)
    l = len(request.json_body)
    fmt = """Length is {} \n
    """
    return fmt.format(l)

@view_config(route_name='echo',
             request_method='POST',
             xhr=True,
             renderer='json')
def echo_xhr_post_view(request):
    log.debug(request.json_body)
    response = request.response
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
    })
    l = len(request.json_body)
    fmt = """Length is {} \n
    """
    return fmt.format(l)

@view_config(route_name='echo',
             request_method='GET',
             renderer='json')
def echo_get_view(request):
    log.debug(request)
    return 'Hello World'

@view_config(route_name='echo',
             request_method='POST',
             renderer='json')
def echo_post_view(request):
    log.debug(request)
    return 'Hello World'
