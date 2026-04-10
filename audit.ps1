# Bound Repo Audit Script
# Run from: D:\MEGA\MEGAsync\GitHub\Bound
# Output: audit-report.txt

$root = Get-Location
$report = @()
$report += "=== BOUND REPO AUDIT ==="
$report += "Run at: $(Get-Date)"
$report += "Root: $root"
$report += ""

# --- 1. BRACKET-NAMED FILES ---
$report += "--- BRACKET-NAMED FILES (expected from handover) ---"
$bracketTargets = @(
    "pages\api\posts\[type].ts",
    "pages\api\chat\[threadId].ts",
    "pages\api\chat\[partnerId].ts"
)
foreach ($f in $bracketTargets) {
    $full = Join-Path $root $f
    if (Test-Path $full) {
        $lines = (Get-Content $full | Measure-Object -Line).Lines
        $report += "  FOUND ($lines lines): $f"
    } else {
        $report += "  MISSING: $f"
    }
}
$report += ""

# --- 2. EXPECTED FILES CHECKLIST ---
$report += "--- EXPECTED FILES CHECKLIST ---"
$expected = @(
    "src\lib\eventEmitter.ts",
    "src\lib\stores\realTime.ts",
    "src\routes\+layout.svelte",
    "static\manifest.json",
    "prisma\schema.prisma",
    "load-test\loadtest.yml",
    ".github\workflows\ci.yml",
    "jest.config.js",
    "cypress.config.js",
    "api\auth\register.ts",
    "api\auth\login.ts",
    "api\groups\index.ts",
    "api\profile\index.ts",
    "api\socket\events.ts",
    "components\PostForm.svelte"
)
foreach ($f in $expected) {
    $full = Join-Path $root $f
    if (Test-Path $full) {
        $lines = (Get-Content $full | Measure-Object -Line).Lines
        $flag = if ($lines -le 5) { " *** STUB/EMPTY" } else { "" }
        $report += "  FOUND ($lines lines)$flag`: $f"
    } else {
        $report += "  MISSING: $f"
    }
}
$report += ""

# --- 3. STACK INCONSISTENCY SCAN ---
$report += "--- STACK INCONSISTENCY SCAN ---"

# Next.js markers
$nextFiles = Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.js" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules" } |
    Select-String -Pattern 'NextApiRequest|NextApiResponse|getServerSideProps|getStaticProps' |
    Select-Object -ExpandProperty Path -Unique
if ($nextFiles) {
    $report += "  NEXT.JS patterns found in:"
    foreach ($f in $nextFiles) { $report += "    $($f.Replace($root.Path,''))" }
} else {
    $report += "  No Next.js patterns found."
}
$report += ""

# Express markers
$expressFiles = Get-ChildItem -Recurse -Include "*.ts","*.js" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules" } |
    Select-String -Pattern 'express\(\)|Router\(\)|app\.use\(|app\.get\(|app\.post\(' |
    Select-Object -ExpandProperty Path -Unique
if ($expressFiles) {
    $report += "  EXPRESS patterns found in:"
    foreach ($f in $expressFiles) { $report += "    $($f.Replace($root.Path,''))" }
} else {
    $report += "  No Express patterns found."
}
$report += ""

# SvelteKit markers
$svelteFiles = Get-ChildItem -Recurse -Include "*.svelte","*.ts" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules" } |
    Select-String -Pattern '\+page\.svelte|\+layout\.svelte|\+server\.ts' |
    Select-Object -ExpandProperty Path -Unique
if ($svelteFiles) {
    $report += "  SVELTEKIT patterns found in:"
    foreach ($f in $svelteFiles) { $report += "    $($f.Replace($root.Path,''))" }
} else {
    $report += "  No SvelteKit patterns found."
}
$report += ""

# --- 4. ALL SOURCE FILES (non-node_modules) ---
$report += "--- ALL SOURCE FILES ---"
$allSource = Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.js","*.svelte" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules" } |
    Sort-Object FullName
foreach ($f in $allSource) {
    $lines = (Get-Content $f.FullName | Measure-Object -Line).Lines
    $flag = if ($lines -le 5) { " *** STUB" } else { "" }
    $report += "  ($lines ln)$flag  $($f.FullName.Replace($root.Path,''))"
}
$report += ""

# --- 5. PACKAGE.JSON ---
$report += "--- PACKAGE.JSON ---"
$pkg = Join-Path $root "package.json"
if (Test-Path $pkg) {
    $report += Get-Content $pkg
} else {
    $report += "  MISSING - no package.json found at root."
}
$report += ""

# --- WRITE REPORT ---
$outPath = Join-Path $root "audit-report.txt"
$report | Out-File -FilePath $outPath -Encoding utf8
Write-Host "Audit complete. Report saved to: $outPath" -ForegroundColor Green
Write-Host "Open it with: notepad audit-report.txt" -ForegroundColor Cyan