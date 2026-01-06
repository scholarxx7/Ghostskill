# Detailed Gemini API Diagnostics
# Run with: .\test-gemini-detailed.ps1

Write-Host "`n🔬 Detailed Gemini API Diagnostics`n" -ForegroundColor Cyan

# Load environment
$envFile = ".\backend\.env"
$GOOGLE_API_KEY = ""

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*GOOGLE_API_KEY\s*=\s*(.+)\s*$') {
            $GOOGLE_API_KEY = $matches[1].Trim()
        }
    }
}

if (-not $GOOGLE_API_KEY) {
    Write-Host "❌ No API key found in backend\.env" -ForegroundColor Red
    exit 1
}

$maskedKey = $GOOGLE_API_KEY.Substring(0, [Math]::Min(15, $GOOGLE_API_KEY.Length)) + "..."
Write-Host "API Key: $maskedKey`n" -ForegroundColor Gray

# Test different endpoints
$endpoints = @(
    @{
        Name = "gemini-pro (v1beta)"
        Url  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    },
    @{
        Name = "gemini-1.5-flash (v1beta)"
        Url  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    },
    @{
        Name = "gemini-1.5-pro (v1beta)"
        Url  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
    }
)

$testPayload = @{
    contents         = @(
        @{
            parts = @(
                @{ text = "Say 'Hello' in one word." }
            )
        }
    )
    generationConfig = @{
        temperature     = 0.7
        maxOutputTokens = 10
    }
} | ConvertTo-Json -Depth 10

foreach ($endpoint in $endpoints) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "Testing: $($endpoint.Name)" -ForegroundColor Cyan
    Write-Host "URL: $($endpoint.Url)" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$($endpoint.Url)?key=$GOOGLE_API_KEY" `
            -Method Post `
            -Body $testPayload `
            -ContentType "application/json" `
            -TimeoutSec 10 `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.candidates -and $data.candidates[0].content.parts[0].text) {
            Write-Host "✅ SUCCESS!" -ForegroundColor Green
            Write-Host "   Response: $($data.candidates[0].content.parts[0].text)" -ForegroundColor Green
            Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
            Write-Host "`n✨ This endpoint is working! Update ai.service.ts to use:" -ForegroundColor Yellow
            Write-Host "   const GEMINI_API_URL = '$($endpoint.Url)';" -ForegroundColor White
            break
        }
        else {
            Write-Host "⚠️  Unexpected response format" -ForegroundColor Yellow
        }
    }
    catch {
        $statusCode = "Unknown"
        $errorMessage = $_.Exception.Message
        
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            
            # Try to read error body
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd()
                $reader.Close()
                
                Write-Host "❌ FAILED - Status: $statusCode" -ForegroundColor Red
                Write-Host "   Error Body:" -ForegroundColor Gray
                Write-Host "   $errorBody" -ForegroundColor DarkRed
            }
            catch {
                Write-Host "❌ FAILED - Status: $statusCode" -ForegroundColor Red
                Write-Host "   Message: $errorMessage" -ForegroundColor DarkRed
            }
        }
        else {
            Write-Host "❌ FAILED" -ForegroundColor Red
            Write-Host "   Error: $errorMessage" -ForegroundColor DarkRed
        }
    }
    
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "`n📋 TROUBLESHOOTING TIPS`n" -ForegroundColor Yellow

Write-Host "If all tests failed with 404:" -ForegroundColor White
Write-Host "  1. Verify your API key at: https://aistudio.google.com/app/apikey" -ForegroundColor Gray
Write-Host "  2. Ensure Gemini API is enabled for your project" -ForegroundColor Gray
Write-Host "  3. Check if the API key has proper permissions" -ForegroundColor Gray

Write-Host "`nIf tests failed with 403:" -ForegroundColor White
Write-Host "  1. API key may be invalid or expired" -ForegroundColor Gray
Write-Host "  2. Generate a new key from Google AI Studio" -ForegroundColor Gray

Write-Host "`nIf tests failed with 429:" -ForegroundColor White
Write-Host "  1. You've hit rate limits" -ForegroundColor Gray
Write-Host "  2. Wait a few minutes and try again" -ForegroundColor Gray

Write-Host "`n"
