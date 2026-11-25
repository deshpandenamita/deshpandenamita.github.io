# Speaks each line of a JSON list into its own WAV file using the built-in Windows voice.
# Usage: powershell -File tts.ps1 -Json lines.json -OutDir dir -Voice "Microsoft Zira Desktop"
param([string]$Json, [string]$OutDir, [string]$Voice = 'Microsoft Zira Desktop', [int]$Rate = -1)
Add-Type -AssemblyName System.Speech
$lines = Get-Content $Json -Raw -Encoding UTF8 | ConvertFrom-Json
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice($Voice)
$s.Rate = $Rate
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
for ($i = 0; $i -lt $lines.Count; $i++) {
  $out = Join-Path $OutDir ("line{0:D2}.wav" -f $i)
  $s.SetOutputToWaveFile($out, $fmt)
  $s.Speak([string]$lines[$i])
}
$s.SetOutputToNull()
$s.Dispose()
"spoke $($lines.Count) lines"
