# Build the app
eas build -p android --profile preview

# Copy latest apk to remote
releaseDate=`date "+%B %d, %Y"`
author="despair" 
while getopts V:v:a: flag
do
    case "${flag}" in
        V) majorVersion=${OPTARG};;
        v) minorVersion=${OPTARG};;
        a) author=${OPTARG};;
    esac
done
scp `ls -t ~/Downloads/*.apk | head -1` "ubuntu@oci:/var/www/html/release/shere_khan_v${majorVersion}_${minorVersion}.apk"

# Update release info
jq -n \
    --arg rd "$releaseDate" \
    --arg at "$author" \
    --arg ap "shere_khan_v${majorVersion}_${minorVersion}.apk" \
    --arg vr "$majorVersion.$minorVersion" \
    '{release: $vr, author: $at, updateDate: $rd, apk: $ap}' > /tmp/release_info.json

scp  /tmp/release_info.json "ubuntu@oci:/var/www/html/release/release_info.json"
