<#
    .SYNOPSIS
    Helper script to migrate Hexo content to Pliny blog format.
#>
[cmdletbinding()]
Param(
    [Parameter(Mandatory = $True)][string]$TargetDir
)

Set-StrictMode -Version Latest
$PSDefaultParameterValues['*:ErrorAction'] = "Stop" # stop on first error

# here we go
$sourceDir = "./source/_posts"
$oldContentFiles = Get-ChildItem $sourceDir -File

<#
    .SYNOPSIS
    Translate hexo specific `% asset_img %}` tags to plain markdown

    From: {% asset_img apple-file-encryption-determination-flow.png 'Apple file encryption determination flow' %}
    To:   ![Apple file encryption determination flow](/static/images/blog/2013/03/when-is-your-sensitive-iphone-slash-ipad-data-encrypted-slash-secure/apple-file-encryption-determination-flow.png)
#>
function replaceHexoImageTags($FileContent, $Year, $Month, $Slug) {
    # first find matching lines and their line number
    Write-Host "Finding Hexo image tags"
    $hits = [System.Collections.ArrayList]@()

    $i = 0
    $FileContent | ForEach-Object {

        if ($_ -match ".+asset_img\s(.+)\s\'(.+)\'") {
            # $matches[1] = file name
            # $matches[2] = alt text

            Write-Host "=> image tag found at $i = $($_)"

            Write-Host "matches 1 = $($matches[1])"
            Write-Host "matches 2 = $($matches[2])"

            $hits.Add(@{
                LineNumber = $i
                Line = $_
                NewLine = "![$($matches[2])](/static/images/blog/$Year/$Month/$Slug/$($matches[1]))"

            }) | Out-Null
        }

        $i++
    }

    # next, replace each line with the markdown image string
    Write-Host "Replacing Hexo image tags:"
    $hits | ForEach-Object {
        Write-Host "=> new line $($_.LineNumber) = $($_.NewLine)"

        $mdxContent[$_.LineNumber] = $_.NewLine
    }

    return $FileContent
}

<#
    .SYNOPSIS
    Translate hexo specific markdown image tag to yyyy-dd format

    From: ![Microsoft Office 2016 Ribbon](office-2016-ribbon.png)
    To:   ![Microsoft Office 2016 Ribbon](/static/images/blog/2015/10/how-to-remove-add-ins-from-office-2016/office-2016-ribbon.png)

    .LINK
    https://regex101.com/r/DfC1yy/1
#>
function replaceMarkdownImageTags($FileContent, $Year, $Month, $Slug) {
    # first find matching lines and their line number
    Write-Host "Finding Markdown image tags:"
    $hits = [System.Collections.ArrayList]@()

    $i = 0
    $FileContent | ForEach-Object {

        $regexResult = [regex]::Matches($_, '(?<leading>.+|)\!\[(?<alt>.+)\]\((?!http)(?<file>.+)\)(?<trailing>.+|)')

        if ($regexResult) {

            $leadingText = $regexResult[0].Groups['leading']
            $altText = $regexResult[0].Groups['alt']
            $file = $regexResult[0].Groups['file']
            $trailingText = $regexResult[0].Groups['trailing']

            Write-Host "=> image tag found at $i = $($_)"

            $hits.Add(@{
                LineNumber = $i
                Line = $_
                NewLine = "$leadingText![$altText](/static/images/blog/$Year/$Month/$Slug/$file))$trailingText"

            }) | Out-Null
        }

        $i++
    }

    # next, replace each line with the markdown image string
    Write-Host "Replacing Markdown image tags:"
    $hits | ForEach-Object {
        Write-Host "=> new line $($_.LineNumber) = $($_.NewLine)"

        $mdxContent[$_.LineNumber] = $_.NewLine
    }

    return $FileContent
}

<#
    .SYNOPSIS
    Translate hexo specific markdown links (to internal pages) to yyyy-dd format

    From: [How to build a CakePHP 3 REST API in minutes](/2015/04/how-to-build-a-cakephp-3-rest-api-in-minutes/)
    To:   [How to build a CakePHP 3 REST API in minutes](/blog/2015/04/how-to-build-a-cakephp-3-rest-api-in-minutes/)

    .LINK
    https://regex101.com/r/MkvS6P/1
#>
function replaceInternalMarkdownLinks($FileContent, $Year, $Month, $Slug) {
    # first find matching lines and their line number
    Write-Host "Finding internal Markdown links:"
    $hits = [System.Collections.ArrayList]@()

    $i = 0
    $FileContent | ForEach-Object {

        $regexResult = [regex]::Matches($_, '(?<leading>.+|)\[(?<alt>(.+))\]\(\/(?<slug>\d\d\d\d\/\d\d\/.+)\)(?<trailing>.+|)')

        if ($regexResult) {
            Write-Host "=> link found at $i = $($_)"

            $leadingText = $regexResult[0].Groups['leading']
            $altText = $regexResult[0].Groups['alt']
            $slug = $regexResult[0].Groups['slug']
            $trailingText = $regexResult[0].Groups['trailing']

            $hits.Add(@{
                LineNumber = $i
                Line = $_
                NewLine = "$leadingText[$altText](/blog/$slug)$trailingText"

            }) | Out-Null
        }

        $i++
    }

    # next, replace each line with the markdown image string
    Write-Host "Replacing Markdown links:"
    $hits | ForEach-Object {
        Write-Host "=> new line $($_.LineNumber) = $($_.NewLine)"

        $mdxContent[$_.LineNumber] = $_.NewLine
    }

    return $FileContent
}


function main() {
    Write-Host "Target dir = $TargetDir"

    if (Test-Path -Path $TargetDir) {
        Write-Output "=> removing target dir"
        Remove-Item -Path $TargetDir -Recurse
        New-Item -Path $TargetDir -ItemType Directory
    }

    $TargetDir = Get-Item -Path $TargetDir

    # process each post
    $oldContentFiles | ForEach-Object {
        Write-Host "Processing $($_):" -BackgroundColor Magenta
        $oldFile = $_

        $year, $month, $day, $slug = $oldFile.BaseName -Split '-', 4

        # $year
        # $month
        # $day
        # $slug

        $targetDirYear = "$TargetDir\data\blog\$year"
        $targetDirMonth = "$targetDirYear\$month"
        $targetDirPost = "$targetDirMonth"
        $targetDirPostImages = "$targetDir\public\static\images\blog\$year\$month\$slug"
        $targetMdx = "$targetDirPost\$slug.mdx"

        Write-Host "- targetDirYear   = $targetDirYear"
        Write-Host "- targetDirMonth  = $targetDirMonth"
        Write-Host "- targetDirPost   = $targetDirPost"
        Write-Host "- targetDirImages = $targetDirPostImages"
        Write-Host "- targetMdx        = $targetMdx"

        # ===================================================================
        # Create MDX
        # ===================================================================
        # create target directory for the "year" if needed
        if (-not(Test-Path -Path $targetDirYear)) {
            Write-Host "Creating target directory for year $targetDirYear"
            New-Item -Path $targetDirYear -ItemType Directory | Out-Null
        }

        # create target directory for the "month" if needed
        if (-not(Test-Path -Path $targetDirMonth)) {
            Write-Host "Creating target directory for month $targetDirMonth"
            New-Item -Path $targetDirMonth -ItemType Directory | Out-Null
        }

        # copy md file to target location as MDX
        Copy-Item -Path $_ -Destination $targetMdx

        # ===================================================================
        # Update internal markdown links
        # ===================================================================
        Write-Host "Immporting MDX"
        [System.Collections.ArrayList]$mdxContent = Get-Content $targetMdx

        Write-Host "Updating internal markdown links:"
        $mdxContent = replaceInternalMarkdownLinks -FileContent $mdxContent -Year $year -Month $month -Slug $slug

        # ===================================================================
        # Copy images (if any)
        # ===================================================================
        $sourcePostImageDir = "$($oldFile.DirectoryName)\$($oldFile.BaseName)"
        Write-Host "Looking for images in $sourcePostImageDir"

        if(-not(Test-Path $sourcePostImageDir)) {
            Write-Host "=> NO IMAGES found in $($sourcePostImageDir)"

            # update mdx before continuing with next file
            Write-Host "=> overwriting file"
            $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
            [System.IO.File]::WriteAllLines($targetMdx, $mdxContent, $Utf8NoBomEncoding)

            Return
        }

        # still here, create the images folder
        if(-not(Test-Path -Path $targetDirPostImages)) {
            Write-Host "=> creating image directory $targetDirPostImages"
            New-Item -Path $targetDirPostImages -ItemType Directory | Out-Null
        }

        # copy all images to target image folder
        Get-ChildItem $sourcePostImageDir -File | ForEach-Object {
            Write-Host "=> copying image $($_.FullName)"
            Copy-Item -Path $_.FullName -Destination $targetDirPostImages
        }

        # ===================================================================
        # Update image tags
        # ===================================================================
        Write-Host "Updating (Hexo and Markdown) image tags"

        $mdxContent = replaceMarkdownImageTags -FileContent $mdxContent -Year $year -Month $month -Slug $slug
        $mdxContent = replaceHexoImageTags -FileContent $mdxContent -Year $year -Month $month -Slug $slug

        Write-Host "=> overwriting file"
        $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
        [System.IO.File]::WriteAllLines($targetMdx, $mdxContent, $Utf8NoBomEncoding)

        # break
    }

    Write-Host "Migration completed successfully!" -ForegroundColor Magenta

}

main
