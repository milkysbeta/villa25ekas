# Recreates the double-click launcher in the project root.
#   powershell -ExecutionPolicy Bypass -File tools\make-shortcut.ps1
#
# .lnk files hard-code absolute paths, so they are not committed — run this
# once after cloning, or if the shortcut is deleted.

$root = Split-Path -Parent $PSScriptRoot
$sh = New-Object -ComObject WScript.Shell
$lnk = $sh.CreateShortcut("$root\START DEMO.lnk")
$lnk.TargetPath       = "$root\tools\start-demo.cmd"
$lnk.WorkingDirectory = "$root\tools"
$lnk.IconLocation     = "$root\Villa 25 Ekas.ico,0"
$lnk.Description      = "Start the Villa 25 Ekas demo site and open it in your browser"
$lnk.WindowStyle      = 1
$lnk.Save()

Write-Host "Created: $root\START DEMO.lnk"
