# Publishes MoneyMap into the portfolio repo's moneymap/ folder:
#   https://deshpandenamita.github.io/moneymap/
# One commit on top of the current portfolio. Only paths under moneymap/ change; portfolio files are kept.
# Run from anywhere:  .\publish.ps1
$ErrorActionPreference = 'Stop'
$gh     = 'C:\Program Files\GitHub CLI\gh.exe'
$repo   = 'deshpandenamita/deshpandenamita.github.io'
$prefix = 'moneymap/'
$here   = $PSScriptRoot
$tmp    = Join-Path $env:TEMP 'moneymap-publish.json'

function Api($method, $path, $body) {
  [IO.File]::WriteAllText($tmp, ($body | ConvertTo-Json -Depth 6 -Compress))
  $out = & $gh api -X $method "repos/$repo/$path" --input $tmp
  if ($LASTEXITCODE -ne 0) { throw "GitHub API call failed: $method $path" }
  $out | ConvertFrom-Json
}

$headSha  = (& $gh api "repos/$repo/git/ref/heads/main" | ConvertFrom-Json).object.sha
$headTree = (& $gh api "repos/$repo/git/commits/$headSha" | ConvertFrom-Json).tree.sha
$old = (& $gh api "repos/$repo/git/trees/$headTree`?recursive=1" | ConvertFrom-Json).tree

# Keep every existing file outside moneymap/, then add the current MoneyMap files.
$tree = @($old | Where-Object { $_.type -eq 'blob' -and -not $_.path.StartsWith($prefix) } | ForEach-Object { @{ path = $_.path; mode = $_.mode; type = 'blob'; sha = $_.sha } })
$kept = $tree.Count
$files = Get-ChildItem $here -File -Recurse | Where-Object { $_.FullName -notmatch '\\__pycache__\\' }
$i = 0
foreach ($f in $files) {
  $i++
  $rel = $prefix + $f.FullName.Substring($here.Length + 1).Replace('\', '/')
  $blob = Api POST 'git/blobs' @{ content = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName)); encoding = 'base64' }
  $tree += @{ path = $rel; mode = '100644'; type = 'blob'; sha = $blob.sha }
  if ($i % 10 -eq 0) { "uploaded $i of $($files.Count)" }
}
$newTree = Api POST 'git/trees' @{ tree = $tree }
$commit  = Api POST 'git/commits' @{ message = 'Publish MoneyMap'; tree = $newTree.sha; parents = @($headSha) }
$null    = Api PATCH 'git/refs/heads/main' @{ sha = $commit.sha }
Remove-Item $tmp -ErrorAction SilentlyContinue
"Kept $kept portfolio files, published $($files.Count) MoneyMap files. Live in a minute or two: https://deshpandenamita.github.io/moneymap/"
