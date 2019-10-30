## 更新系统环境变量

    PS> [environment]::SetEnvironmentvariable("WSLENV", "WINDOWS_USERNAME", "User")
    PS> [environment]::GetEnvironmentvariable("WSLENV", "User")
    WINDOWS_USERNAME

## 多行

You can use a space followed by the grave accent (backtick):

```
Get-ChildItem -Recurse `
  -Filter *.jpg `
  | Select LastWriteTime
```

However, this is only ever necessary in such cases as shown above. Usually you get automatic line continuation when a command cannot syntactically be complete at that point. This includes starting a new pipeline element:

```
Get-ChildItem |
  Select Name,Length
```

will work without problems since after the | the command cannot be complete since it's missing another pipeline element. Also opening curly braces or any other kind of parentheses will allow line continuation directly:

```
$x=1..5
$x[
  0,3
] | % {
  "Number: $_"
}
```

Similar to the | a comma will also work in some contexts:

```
1,
2
```

Keep in mind, though, similar to JavaScript's Automatic Semicolon Insertion, there are some things that are similarly broken because the line break occurs at a point where it is preceded by a valid statement:

```
return
  5
```

will not work.

Finally, strings (in all varieties) may also extend beyond a single line:

```
'Foo
bar'
```

They include the line breaks within the string, then.

