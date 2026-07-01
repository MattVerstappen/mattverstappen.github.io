# Audio Randomizer
Type: tool | Degree: Solo | Date: 2026 | Status: completed
Stack: C#, Unity

A MonoBehaviour audio randomizer for Unity that solves the most common audio problem in game development: the machine gun effect caused by the same clip repeating consecutively. The system maintains a queue of recently played clips and excludes them from the next pick, with a configurable anti-repeat count. Clips are assigned weights so some sounds play more frequently than others. Each play randomises pitch and volume within configurable min and max ranges, and the system automatically falls back to unrestricted selection when the pool is too small to satisfy the exclusion queue. Includes a play-mode Inspector preview with live queue visualisation.
