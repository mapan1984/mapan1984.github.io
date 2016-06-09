### ls -l

    $ ls -l a.txt
    -rw-r--r-- 1 mapan mapan 327 Jun  6 22:53 a.txt

1. file type

        -: file
        l: sym link
        d: directory
        ...: ...

2. user-permission

        rw-: owner file mode
        r--: group file mode
        r--: world file mode

3. link number

        1 link number

4. owner

        mapan

5. group

        mapan

6. size in byte

        327

7. last modify time

        Jun 6 22:53 

8. file name

        a.txt

### file permission

1. dir
    * r --- ls dir
    * w --- create/delete/rename files in it
    * x --- cd dir
    * -

2. file
    * r --- cat file
    * w --- file
    * x --- ./a.sh
    * - 

### change file mode

    $ chmod 666 a.txt    # chmod 110110110 a.txt
    $ ls -l a.txt
    -rw-rw-rw- 1 mapan mapan 327 Jun  6 22:55 a.txt

    $ chmod u+x a.txt
    $ chmod u-x a.txt
    $ chmod o-x a.txt
