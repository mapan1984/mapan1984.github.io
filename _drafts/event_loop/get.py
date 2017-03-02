from time import time

from event import Event


class ReadFromURL(Event):

    def __init__(self, url):
        super(SleepEvent, self).__init_()
        self.url = url
        self.value = None

    def _is_ready(self):
        self.value = url_open(url).read()
        return self.value is not None


def read_form_url(url):
    return ReadFromURL(url)

def _next(task, value=None):
    try:
        event = task.send(value)
        event.set_callback(_next(task, event.value))
    except StopIteration:
        pass

