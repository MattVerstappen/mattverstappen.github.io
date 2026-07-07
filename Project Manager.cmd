@echo off
rem Double-click me to open the MDR Project Manager.
rem Starts a local-only server and opens the app in your browser.
rem Keep this window open while using it; close it (or Ctrl+C) when done.
cd /d "%~dp0"
title MDR Project Manager
node scripts\project-manager.js
if errorlevel 1 pause
