# Weighted Random Selector
Type: tool | Degree: Solo | Date: 2026 | Status: completed
Stack: C#, Unity

A fully generic weighted random selector built for Unity in C#. Any collection of items can be assigned float weights and selected at runtime with statistically correct probability distribution. A single Random.Range call against the accumulated weight ensures efficient O(n) selection. The included Inspector integration displays a visual weight bar for each entry showing its percentage of the total weight, making it easy to balance loot tables, enemy spawn rates, or any probability-driven system. Supports runtime add and remove operations and throws descriptive exceptions for invalid configurations.
