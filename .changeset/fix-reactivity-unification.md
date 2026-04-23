---
"@opentf/web": minor
---

Fix reactivity issues by re-exporting all signals from the core package and updating the compiler to use a unified reactivity instance. This prevents state-update failures in complex project structures.
