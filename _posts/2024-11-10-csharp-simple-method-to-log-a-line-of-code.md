---
title: CSharp - Simple method to log a line of code
categories:
  - Sharing
  - CSharp
description: CSharp Simple method to log a line of code
author: xuxu
tags: [Sharing, CSharp]
type: Document
---

Put this method anywhere in your code: 

```csharp
public static void LogCaller(
      [System.Runtime.CompilerServices.CallerLineNumber] int line = 0
    , [System.Runtime.CompilerServices.CallerMemberName] string memberName = ""
    , [System.Runtime.CompilerServices.CallerFilePath] string filePath = ""
)
{
    // Can replace UnityEngine.Debug.Log with any logging API you want
    UnityEngine.Debug.Log($"{line} :: {memberName} :: {filePath}");
}
```

Usage is simple: just put a LogCaller(); at any line you want. The compiler will pass in the 3 parameters for you.

Example: **LogCallerTest.cs**

```csharp
using UnityEngine;

public class LogCallerTest : MonoBehaviour
{
    private void Awake()
    {
        LogCaller(); // 7 :: Awake :: LogCallerTest.cs
    }
    
    private void Update()
    {
        LogCaller(); // 12 :: Update :: LogCallerTest.cs
    }
    
    public static void LogCaller(
          [System.Runtime.CompilerServices.CallerLineNumber] int line = 0
        , [System.Runtime.CompilerServices.CallerMemberName] string memberName = ""
        , [System.Runtime.CompilerServices.CallerFilePath] string filePath = ""
    )
    {
        UnityEngine.Debug.Log($"{line} :: {memberName} :: {filePath}");
    }
}
```