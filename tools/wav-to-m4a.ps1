# Compresses WAV files to m4a (AAC) with Windows' own encoder (Media Foundation).
# Used by tools/make-speech.mjs: powershell -File tools/wav-to-m4a.ps1 <folder>
# Every <name>.wav in the folder becomes <name>.m4a next to it.
param([string]$Folder)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
} | Select-Object -First 1
$asProgress = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncActionWithProgress`1'
} | Select-Object -First 1
function Await($op, $type) {
    $task = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
    $task.Wait()
    $task.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Transcoding.MediaTranscoder, Windows.Media.Transcoding, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.MediaProperties.MediaEncodingProfile, Windows.Media.MediaProperties, ContentType = WindowsRuntime] | Out-Null

$profile = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateM4a([Windows.Media.MediaProperties.AudioEncodingQuality]::Medium)
$profile.Audio.ChannelCount = 1
$profile.Audio.SampleRate = 22050
$profile.Audio.Bitrate = 48000
$transcoder = New-Object Windows.Media.Transcoding.MediaTranscoder
$folderItem = Await ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync((Resolve-Path $Folder).Path)) ([Windows.Storage.StorageFolder])

foreach ($wav in Get-ChildItem $Folder -Filter *.wav) {
    $source = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($wav.FullName)) ([Windows.Storage.StorageFile])
    $target = Await ($folderItem.CreateFileAsync($wav.BaseName + '.m4a', 'ReplaceExisting')) ([Windows.Storage.StorageFile])
    $prepared = Await ($transcoder.PrepareFileTranscodeAsync($source, $target, $profile)) ([Windows.Media.Transcoding.PrepareTranscodeResult])
    if (-not $prepared.CanTranscode) {
        throw "Cannot compress $($wav.Name): $($prepared.FailureReason)"
    }
    $asProgress.MakeGenericMethod([double]).Invoke($null, @($prepared.TranscodeAsync())).Wait()
}
