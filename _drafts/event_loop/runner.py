from event import events_list


def _next(task):
    try:
        event = next(task)
        event.set_callback(lambda: _next(task)) # 1
    except StopIteration:
        pass

def run(tasks):
    for task in tasks:
        _next(task)

    while len(events_list):
        for event in events_list:
            if event.is_ready():
                events_list.remove(event)
                break

