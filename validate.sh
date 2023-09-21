#!/bin/bash

# Check if user_id is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <user_id>"
    exit 1
fi

# Assign the provided user_id to the user_id variable
user_id="$1"

# Print a descriptive message with emojis
echo "🔍 Fetching and validating Devtoberfest 2023 badges for user - ${user_id} 🔍"

# Define the URL of the JSON endpoint for Devtoberfest 2023 badges
devtoberfest_badges_url="https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json"

# Use curl to fetch the JSON data and jq to parse it
devtoberfest_badges_data=$(curl -s "$devtoberfest_badges_url" | jq '.')

# Check if the JSON data was successfully retrieved
if ! curl -s -f "$devtoberfest_badges_url" >/dev/null; then
    echo "❌ Failed to retrieve JSON data from $devtoberfest_badges_url ❌"
    exit 1
fi

# Define the URL of the JSON endpoint to fetch user badges with the corrected URL
user_badges_url="https://people-api.services.sap.com/rs/badge/${user_id}?sort=timestamp,desc&size=10000"

# Check if the JSON data was successfully retrieved
if ! curl -s -f "$user_badges_url" >/dev/null; then
    echo "❌ Failed to retrieve JSON data from $user_badges_url ❌"
    exit 1
fi

# Use curl to fetch the JSON data
user_badges=$(curl -s "$user_badges_url" | jq -r '.content[] | select(.displayName | contains("2023")) | .displayName')

# Initialize a variable to keep track of total points
total_points=0

# Loop through each object in the JSON array
for row in $(echo "${devtoberfest_badges_data}" | jq -r '.[] | @base64'); do
    _jq() {
        echo "${row}" | base64 --decode | jq -r "${1}"
    }

    display_name=$(_jq '.displayName')
    points=$(_jq '.points')
    badge_check_mark="❌" # Default to ❌

    if [[ $user_badges =~ $display_name ]]; then
        badge_check_mark="✅"                    # Change to ✅ if it matches
        total_points=$((total_points + points)) # Sum up points
    fi

    echo "${badge_check_mark} ${display_name} [Points: ${points}]"
done

# Print the total points with an emoji
echo "🌟 Total Points for ✅ badges: ${total_points} 🌟"
