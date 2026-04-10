# Bound Cleanup Script
# Run from: D:\MEGA\MEGAsync\GitHub\Bound
# Moves dead code trees to _archive for review — nothing is permanently deleted.
# Review _archive yourself before deleting it.

$root = Get-Location
$archive = Join-Path $root "_archive"
$log = @()
$log += "=== BOUND CLEANUP LOG ==="
$log += "Run at: $(Get-Date)"
$log += ""

function Archive-Dir($rel) {
    $src = Join-Path $root $rel
    $dst = Join-Path $archive $rel
    if (Test-Path $src) {
        $parent = Split-Path $dst -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Move-Item -Path $src -Destination $dst -Force
        $script:log += "  ARCHIVED: $rel"
        Write-Host "  Archived: $rel" -ForegroundColor Yellow
    } else {
        $script:log += "  NOT FOUND (skipped): $rel"
        Write-Host "  Not found (skipped): $rel" -ForegroundColor Gray
    }
}

function Archive-File($rel) {
    $src = Join-Path $root $rel
    $dst = Join-Path $archive $rel
    if (Test-Path $src) {
        $parent = Split-Path $dst -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Move-Item -Path $src -Destination $dst -Force
        $script:log += "  ARCHIVED FILE: $rel"
        Write-Host "  Archived file: $rel" -ForegroundColor Yellow
    } else {
        $script:log += "  NOT FOUND (skipped): $rel"
    }
}

# --- STEP 1: Create archive root ---
Write-Host ""
Write-Host "=== STEP 1: Creating _archive ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $archive -Force | Out-Null
$log += "--- Step 1: Archive directory created at _archive ---"
$log += ""

# --- STEP 2: Archive dead backends ---
Write-Host ""
Write-Host "=== STEP 2: Archiving dead backends ===" -ForegroundColor Cyan
$log += "--- Step 2: Dead backends ---"

# NestJS backend
Archive-Dir "backend"

# Next.js fragments at root
Archive-Dir "pages"

# React/Redux client stubs
Archive-Dir "client"

$log += ""

# --- STEP 3: Archive Firebase (conflicts with privacy-first principles) ---
Write-Host ""
Write-Host "=== STEP 3: Archiving Firebase ===" -ForegroundColor Cyan
$log += "--- Step 3: Firebase ---"
Archive-File "server\src\firebase.js"
$log += ""

# --- STEP 4: Merge useful stubs from \src into \frontend\src ---
Write-Host ""
Write-Host "=== STEP 4: Merging \src into \frontend\src ===" -ForegroundColor Cyan
$log += "--- Step 4: Merge \src into \frontend\src ---"

# Files worth carrying across (non-stub, or stubs that fill gaps in frontend)
$mergeFiles = @(
    @{ From = "src\lib\components\ConsentTimeline.svelte"; To = "frontend\src\lib\components\ConsentTimeline.svelte" },
    @{ From = "src\lib\components\PushToggle.svelte";      To = "frontend\src\lib\components\PushToggle.svelte" },
    @{ From = "src\lib\components\RichEditor.svelte";      To = "frontend\src\lib\components\RichEditor.svelte" },
    @{ From = "src\lib\featureFlags.ts";                   To = "frontend\src\lib\featureFlags.ts" },
    @{ From = "src\lib\graphql\pubsub.ts";                 To = "frontend\src\lib\graphql\pubsub.ts" },
    @{ From = "src\lib\queue.ts";                          To = "frontend\src\lib\queue.ts" },
    @{ From = "src\lib\sdk\index.ts";                      To = "frontend\src\lib\sdk\index.ts" },
    @{ From = "src\lib\sdk\openapi.ts";                    To = "frontend\src\lib\sdk\openapi.ts" },
    @{ From = "src\routes\admin\jobs\polls\+page.svelte";  To = "frontend\src\routes\admin\jobs\polls\+page.svelte" },
    @{ From = "src\routes\admin\metrics\+page.svelte";     To = "frontend\src\routes\admin\metrics\+page.svelte" },
    @{ From = "src\routes\admin\rate-limit\+page.svelte";  To = "frontend\src\routes\admin\rate-limit\+page.svelte" },
    @{ From = "src\routes\admin\sessions\+page.svelte";    To = "frontend\src\routes\admin\sessions\+page.svelte" }
)

foreach ($m in $mergeFiles) {
    $src = Join-Path $root $m.From
    $dst = Join-Path $root $m.To
    if (Test-Path $src) {
        # Don't overwrite if destination already has more content
        $srcLines = (Get-Content $src | Measure-Object -Line).Lines
        if (Test-Path $dst) {
            $dstLines = (Get-Content $dst | Measure-Object -Line).Lines
            if ($dstLines -ge $srcLines -and $dstLines -gt 5) {
                $log += "  SKIPPED (destination fuller): $($m.To)"
                Write-Host "  Skipped (destination fuller): $($m.To)" -ForegroundColor Gray
                continue
            }
        }
        $parent = Split-Path $dst -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Copy-Item -Path $src -Destination $dst -Force
        $log += "  MERGED: $($m.From) -> $($m.To)"
        Write-Host "  Merged: $($m.From)" -ForegroundColor Green
    } else {
        $log += "  NOT FOUND (skipped): $($m.From)"
        Write-Host "  Not found (skipped): $($m.From)" -ForegroundColor Gray
    }
}

# Archive the now-redundant \src tree
Archive-Dir "src"
$log += ""

# --- STEP 5: Flag duplicate migrations ---
Write-Host ""
Write-Host "=== STEP 5: Flagging duplicate migrations ===" -ForegroundColor Cyan
$log += "--- Step 5: Duplicate migration analysis ---"
$log += "  The following migration files are 1-line stubs and should be replaced or removed."
$log += "  Review manually in \server\migrations\ before touching."
$log += ""

$stubMigrations = Get-ChildItem -Path (Join-Path $root "server\migrations") -Include "*.js" -ErrorAction SilentlyContinue |
    Where-Object { (Get-Content $_.FullName | Measure-Object -Line).Lines -le 1 }

if ($stubMigrations) {
    foreach ($f in $stubMigrations) {
        $log += "  STUB MIGRATION: $($f.Name)"
        Write-Host "  Stub migration: $($f.Name)" -ForegroundColor Yellow
    }
} else {
    $log += "  No stub migrations found."
}
$log += ""

# --- STEP 6: Summary ---
$log += "--- Summary ---"
$log += "  Canonical frontend: \frontend\src\"
$log += "  Canonical backend:  \server\src\"
$log += "  Archived dead code: \_archive\"
$log += "  Firebase:           archived (review auth strategy)"
$log += "  Stub migrations:    flagged above (review manually)"
$log += ""
$log += "  Next steps:"
$log += "  1. Review _archive\ - delete it when satisfied"
$log += "  2. Replace stub migrations or consolidate into Prisma schema"
$log += "  3. Wire frontend\src\ to server\src\ with a single base URL"
$log += "  4. Continue feature work: notifications, search, follows"

# --- WRITE LOG ---
$logPath = Join-Path $root "cleanup-log.txt"
$log | Out-File -FilePath $logPath -Encoding utf8
Write-Host ""
Write-Host "Done. Log saved to cleanup-log.txt" -ForegroundColor Green
Write-Host "Review _archive\ before deleting it." -ForegroundColor Cyan