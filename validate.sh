#!/bin/bash

if ! command -v pup &>/dev/null; then
    echo "pup command not found. Installing pup via brew..."
    if command -v go &>/dev/null; then
        brew install pup
    else
        echo "Error: brew command not found. Please install pup manually as per https://github.com/ericchiang/pup"
        exit 1
    fi
fi

# Initialize userInput variable
userInput=""

# Process command-line options
while getopts ":u:" opt; do
    case ${opt} in
    u)
        userInput=${OPTARG}
        ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1
        ;;
    :)
        echo "Option -$OPTARG requires an scnId" >&2
        exit 1
        ;;
    esac
done
shift $((OPTIND - 1))

if [[ -z $userInput ]]; then
    read -p "Enter a scnId: " userInput
fi

response=$(curl -s "https://people-api.services.sap.com/rs/badge/$userInput?sort=timestamp,desc&size=1000")

badges=$(echo "$response" | jq -r '.content[] | select(.displayName | contains("- Devtoberfest 2023 - ")) | .displayName' | awk '{print substr($1, 1, 7)}')

week1=$(curl -s "https://groups.community.sap.com/t5/devtoberfest-blog-posts/devtoberfest-2023-contest-activities-and-points-week-1/ba-p/286328")

table_html=$(echo "$week1" | pup 'table tr td:nth-child(2) p span json{}')

json=$(echo "$table_html" | jq 'map(select(.text | tostring | startswith("#")))')

week1_badges=$(echo "$json" | jq -r '.[] | .text')

for entry in $week1_badges; do
    if [[ $badges =~ $entry ]]; then
        echo "✅ $entry"
    else
        echo "❌ $entry"
    fi
done
