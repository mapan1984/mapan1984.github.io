" job
func! OutHandler(channel, msg)
    echomsg 'OutHandler: ' . a:msg
endfunc

func! CloseHandler(channel)
  while ch_status(a:channel, {'part': 'out'}) == 'buffered'
    echomsg ch_read(a:channel)
  endwhile
endfunc

func! GetDate()
    call job_start(['/bin/bash', '-c', 'sleep 3s; date; sleep 3s; date'],
                \  {'close_cb': 'CloseHandler',
                \   'out_cb': 'OutHandler'})
endfunc

nnoremap <F3> :call GetDate()<cr>

" timer
func MyHandler(timer)
  echom 'Handler called'
endfunc

let timer = timer_start(500, 'MyHandler',
	\ {'repeat': 3})
