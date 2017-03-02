from time import time

from event import Event


class SleepEvent(Event):

    def __init__(self, timeout):
        super(SleepEvent, self).__init__(timeout)
        self.timeout = timeout
        self.start_time = time()
        self.value = None

    def _is_ready(self):
        return time() - self.start_time >= self.timeout

def sleep(timeout):
    return SleepEvent(timeout)

