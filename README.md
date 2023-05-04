# visual-time-sync

This is a web-based tool designed to simplify the process of synchronizing recordings from multiple cameras using a tablet or smartphone. It provides a visual representation of time that can be shown to all the cameras so the recordings can be synchronized later. 

Features:
 - The time is shown with a big timestamp at the top: hh:mm:ss.sss
 - A grid is used to represent the milliseconds and easily see them in the recordings.
 - The FPS are configurable.
 - The screen sleep can be disabled using [NoSleep](https://github.com/richtr/NoSleep.js).
 - Fullscreen mode.
 - Monitors the time offset between Date() and performance.now() and checks if performance.timeOrigin has been changed.
 - A simple log of the can be saved/exported.

