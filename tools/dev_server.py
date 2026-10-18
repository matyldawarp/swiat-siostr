"""Static dev server with live reload.

Serves the project root, injects a small EventSource client into index.html
and tells every connected browser (desktop, iPad, ...) to reload when a file
in the project changes.

Usage: python tools/dev_server.py [port]
"""

import http.server
import os
import sys
import threading
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
IGNORED_DIRS = {'.git', '.claude', '__pycache__', 'node_modules'}
RELOAD_PATH = '/__livereload'
CLIENT_SNIPPET = (
    '<script>new EventSource("' + RELOAD_PATH + '")'
    '.onmessage = () => location.reload();</script>'
).encode('utf-8')

version = 0
changed = threading.Condition()


def snapshot():
    mtimes = {}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        for name in filenames:
            path = os.path.join(dirpath, name)
            try:
                mtimes[path] = os.stat(path).st_mtime
            except OSError:
                pass
    return mtimes


def watch():
    global version
    previous = snapshot()
    while True:
        time.sleep(0.5)
        current = snapshot()
        if current != previous:
            previous = current
            # Let a burst of writes settle before reloading clients.
            time.sleep(0.2)
            previous = snapshot()
            with changed:
                version += 1
                changed.notify_all()
            print('[livereload] change detected, reloading clients', flush=True)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == RELOAD_PATH:
            self.stream_reloads()
        elif path in ('/', '/index.html'):
            self.send_index()
        else:
            super().do_GET()

    def send_index(self):
        with open(os.path.join(ROOT, 'index.html'), 'rb') as f:
            body = f.read().replace(b'</body>', CLIENT_SNIPPET + b'\n</body>', 1)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def stream_reloads(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Connection', 'keep-alive')
        self.end_headers()

        seen = version
        try:
            while True:
                with changed:
                    changed.wait(timeout=15)
                    current = version
                if current != seen:
                    seen = current
                    self.wfile.write(b'data: reload\n\n')
                else:
                    # Keep-alive comment so proxies and Safari keep the stream open.
                    self.wfile.write(b': ping\n\n')
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def log_message(self, format, *args):
        if RELOAD_PATH not in self.path:
            super().log_message(format, *args)


if __name__ == '__main__':
    threading.Thread(target=watch, daemon=True).start()
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    server.daemon_threads = True
    print(f'Serving {ROOT} on http://0.0.0.0:{PORT} with live reload', flush=True)
    server.serve_forever()
