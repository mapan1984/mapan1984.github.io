#!/usr/bin/env python
# coding=utf-8
def cons(x, y):
    def dispatch(m):
        if m == 0:
            return x
        elif m == 1:
            return y
        else:
            print("Argument not 0 or 1 -- CONS",m)
    return dispatch

def car(z):
    return z(0)

def cdr(z):
    return z(1)
