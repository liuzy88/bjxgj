@echo off
javac -encoding utf-8 Main.java
java Main "../img/baba/baba.jpg" "../img/history/2020-11-20_baba.jpg"
"../img/history/2020-11-20_baba.jpg"
choice /c:q /t 10 /d q /n >nul
del "../img/history/2020-11-20_baba.jpg"