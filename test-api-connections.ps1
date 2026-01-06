# Test API Connections
# Run with: .\test-api-connections.ps1

Write-Host "🔍 Testing API Connections...`n" -ForegroundColor Cyan

# Load environment variables from backend/.env if exists
$envFile = ".\backend\.env"
$PYTHON_API_URL = "http://localhost:8000"
$GOOGLE_API_KEY = ""

if (Test-Path $envFile) {
    Write-Host "Loading environment from backend\.env..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($key -eq "PYTHON_API_URL") { $PYTHON_API_URL = $value }
            if ($key -eq "GOOGLE_API_KEY") { $GOOGLE_API_KEY = $value }
        }
    }
}

Write-Host "Configuration:" -ForegroundColor White
Write-Host "  Python API URL: $PYTHON_API_URL" -ForegroundColor Gray
if ($GOOGLE_API_KEY) {
    $maskedKey = $GOOGLE_API_KEY.Substring(0, [Math]::Min(10, $GOOGLE_API_KEY.Length)) + "..."
    Write-Host "  Google API Key: ✅ Set ($maskedKey)" -ForegroundColor Green
} else {
    Write-Host "  Google API Key: ❌ Not set" -ForegroundColor Red
}
Write-Host ""

# Test 1: Python API Health Check
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 1: Python API Health Check" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$pythonHealthPass = $false
try {
    $response = Invoke-RestMethod -Uri "$PYTHON_API_URL/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Python API is healthy!" -ForegroundColor Green
    Write-Host "   Datasets loaded:" -ForegroundColor Gray
    $response.datasets_loaded.PSObject.Properties | ForEach-Object {
        Write-Host "     $($_.Name): $($_.Value) verses" -ForegroundColor Gray
    }
    $pythonHealthPass = $true
} catch {
    Write-Host "❌ Error connecting to Python API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure the Python API is running at: $PYTHON_API_URL" -ForegroundColor Yellow
    Write-Host "   Start it with: cd python-api; python main.py" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Python API Wisdom Fetch
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 2: Python API Wisdom Fetch" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$pythonWisdomPass = $false
if ($pythonHealthPass) {
    try {
        $response = Invoke-RestMethod -Uri "$PYTHON_API_URL/wisdom/chanakya/random" -Method Get -TimeoutSec 5
        Write-Host "✅ Successfully fetched wisdom!" -ForegroundColor Green
        Write-Host "   Sample:" -ForegroundColor Gray
        Write-Host "   Source: $($response.wisdom.source)" -ForegroundColor Gray
        $text = $response.wisdom.text
        if ($text.Length -gt 100) { $text = $text.Substring(0, 100) + "..." }
        Write-Host "   Text: $text" -ForegroundColor Gray
        $pythonWisdomPass = $true
    } catch {
        Write-Host "❌ Error fetching wisdom: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipped (Python API not healthy)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Google Gemini API
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 3: Google Gemini API" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$geminiPass = $false
if (-not $GOOGLE_API_KEY) {
    Write-Host "⚠️  Google API Key not set" -ForegroundColor Yellow
    Write-Host "   Set it in backend\.env: GOOGLE_API_KEY=your_key_here" -ForegroundColor Yellow
    Write-Host "   Get a key from: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
} else {
    try {
        $GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        $body = @{
            contents = @(
                @{
                    parts = @(
                        @{ text = 'Say "API connection successful" in one sentence.' }
                    )
                }
            )
            generationConfig = @{
                temperature = 0.7
                maxOutputTokens = 50
            }
        } | ConvertTo-Json -Depth 10

        $response = Invoke-RestMethod -Uri "$GEMINI_API_URL`?key=$GOOGLE_API_KEY" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
        
        if ($response.candidates -and $response.candidates[0].content.parts[0].text) {
            Write-Host "✅ Gemini API is working!" -ForegroundColor Green
            Write-Host "   Response: $($response.candidates[0].content.parts[0].text)" -ForegroundColor Gray
            $geminiPass = $true
        } else {
            Write-Host "❌ Unexpected response format from Gemini API" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error connecting to Gemini API: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$status1 = if ($pythonHealthPass) { "✅" } else { "❌" }
$status2 = if ($pythonWisdomPass) { "✅" } else { "❌" }
$status3 = if ($geminiPass) { "✅" } else { "❌" }

Write-Host "Python API Health:    $status1" -ForegroundColor $(if ($pythonHealthPass) { "Green" } else { "Red" })
Write-Host "Python API Wisdom:    $status2" -ForegroundColor $(if ($pythonWisdomPass) { "Green" } else { "Red" })
Write-Host "Google Gemini API:    $status3" -ForegroundColor $(if ($geminiPass) { "Green" } else { "Red" })

$allPass = $pythonHealthPass -and $pythonWisdomPass -and $geminiPass
Write-Host "`nOverall Status:       " -NoNewline
if ($allPass) {
    Write-Host "✅ ALL TESTS PASSED" -ForegroundColor Green
} else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Yellow
}

# Next Steps
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (-not $pythonHealthPass) {
    Write-Host "`n1. Start the Python API:" -ForegroundColor Yellow
    Write-Host "   cd python-api" -ForegroundColor Gray
    Write-Host "   python main.py" -ForegroundColor Gray
    Write-Host "   (or: uvicorn main:app --reload)" -ForegroundColor Gray
}

if (-not $geminiPass -and -not $GOOGLE_API_KEY) {
    Write-Host "`n2. Set up Google API Key:" -ForegroundColor Yellow
    Write-Host "   - Get key from: https://makersuite.google.com/app/apikey" -ForegroundColor Gray
    Write-Host "   - Create backend\.env file with:" -ForegroundColor Gray
    Write-Host "     GOOGLE_API_KEY=your_key_here" -ForegroundColor Gray
    Write-Host "     PYTHON_API_URL=http://localhost:8000" -ForegroundColor Gray
}

if ($allPass) {
    Write-Host "`n✨ All systems operational! Ready to use." -ForegroundColor Green
}

Write-Host ""
