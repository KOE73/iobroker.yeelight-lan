@echo off
REM Wrapper script to run the Yeelight CLI scanner through the local LAN interface
node "%~dp0scan.js" --interface 192.168.199.2 %*
