
使用scheme定义的银行账户模拟函数，可以十分完美的保持和更新函数内的balance状态

``` scheme
(define (make-account balance)
  (define (withdraw amount)
    (if (>= balance amount)
        (begin (set! balance (- balance amount))
               balance)
        "Insufficient funds"))
  (define (deposit amount)
    (set! balance (+ balance amount))
    balance)
  (define (dispath m)
    (cond ((eq? m 'withdraw) withdraw)
          ((eq? m 'deposit) deposit)
          (else (error "Unknown request -- MAKE-ACCOUNT"
                       m))))
  dispatch)

>> (define acc (make-account 100))
>> ((acc 'withdraw) 50)
   50
>> ((acc 'deposit) 60)
   110
>> ((acc 'withdraw) 120)
   "Insufficient funds"
```

使用Python定义的同样的函数

``` python
def make_account(balance):
    def withdraw(amount):
        if balance > amount:
            balance = balance - amount
        else:
            print("Insufficient funds")
            
    def deposit(amount):
        balance = balance + amount
    
    def dispath(msg):
        if(msg == "withdraw"):
            return withdraw
        elif(msg == "deposit"):
            return deposit
        
    return dispath
```

``` python
>>> from make_account import make_account
>>> acc = make_account(100)
>>> acc
<function make_account.<locals>.dispath at 0x000001E3DCBAFD90>
>>> acc("withdraw")(10)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "e:\test\make_account.py", line 3, in withdraw
    if balance > amount:
UnboundLocalError: local variable 'balance' referenced before assignment
>>>
```

改进后

``` python
def make_account(balance):
    balance = balance
    def withdraw(amount):
        nonlocal balance
        if balance > amount:
            balance = balance - amount
        else:
            print("Insufficient funds")
            
    def deposit(amount):
        nonlocal balance
        balance = balance + amount
    
    def dispath(msg):
        if(msg == "withdraw"):
            return withdraw
        elif(msg == "deposit"):
            return deposit
        
    return dispath
```
``` python
>>> from make_account02 import make_account
>>> make_account
<function make_account at 0x000001FDBADFFEA0>
>>> s = make_account(100)
>>> s("withdraw")(12)
>>> s("withdraw")(88)
Insufficient funds
>>> s("deposit")(22)
>>>
```
