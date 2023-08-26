# Site for JasonEstey.com

This is my personal web site.

## Local Testing

A lot of the pages will work if opened directly using the `file:` protocol, but there are exceptions. For example, the Flash games pages use Ruffle.rs from a content delivery network (CDN) and will not work correctly if not hosted from a web server.

My go-to for local testing is to use Python 3 and the http.server lib: `python -m http.server`
