#!/bin/bash

# KidZone Category Updater Script
# This script adds missing games to their appropriate category pages
# Run this from the kidzone-learning project root directory

echo "🎮 KidZone Category Updater Starting..."

# Function to backup files
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        cp "$file" "${file}.backup.$(date +%Y%m%d_%H%M%S)"
        echo "✅ Backed up $file"
    fi
}

# Function to add game card to category
add_game_to_category() {
    local category_file=$1
    local game_html=$2
    local icon=$3
    local title=$4
    local description=$5
    local difficulty_stars=$6
    
    # Create the game card HTML
    local game_card="            <div class=\"game-card\">
                <div class=\"game-icon\">$icon</div>
                <h3>$title</h3>
                <p>$description</p>
                <div class=\"difficulty\">"
    
    # Add difficulty stars
    for ((i=1; i<=difficulty_stars; i++)); do
        game_card="${game_card}
                    <span class=\"star\">⭐</span>"
    done
    
    game_card="${game_card}
                </div>
                <a href=\"../games/$game_html\" class=\"btn btn-play\">Play Now!</a>
            </div>"
    
    # Find the closing </div> of games-grid and insert before it
    if grep -q "games-grid" "$category_file"; then
        # Use sed to insert the game card before the last </div> of the games-grid section
        sed -i '/class="games-grid"/,/^        <\/div>$/{
            /^        <\/div>$/{
                i\
'"$game_card"'
            }
        }' "$category_file"
        echo "✅ Added $title to $category_file"
    else
        echo "❌ Could not find games-grid in $category_file"
    fi
}

# Main execution
echo "🔧 Starting category updates..."

# Define paths
CATEGORIES_DIR="pages/categories"
GAMES_DIR="pages/games"

# Check if directories exist
if [ ! -d "$CATEGORIES_DIR" ]; then
    echo "❌ Categories directory not found: $CATEGORIES_DIR"
    echo "Please run this script from the kidzone-learning project root"
    exit 1
fi

if [ ! -d "$GAMES_DIR" ]; then
    echo "❌ Games directory not found: $GAMES_DIR"
    echo "Please run this script from the kidzone-learning project root"
    exit 1
fi

# Backup all category files
echo "📋 Creating backups..."
backup_file "$CATEGORIES_DIR/critical.html"
backup_file "$CATEGORIES_DIR/math.html" 
backup_file "$CATEGORIES_DIR/knowledge.html"
backup_file "$CATEGORIES_DIR/emotional.html"
backup_file "$CATEGORIES_DIR/language.html"
backup_file "$CATEGORIES_DIR/motor.html"

echo ""
echo "🎯 Adding missing games to categories..."

# Add Bridge Builder to Critical Thinking
add_game_to_category "$CATEGORIES_DIR/critical.html" "bridge-builder.html" "🌉" "Bridge Builder" "Build bridges to cross gaps!" 4

# Add Code Blocks to Critical Thinking  
add_game_to_category "$CATEGORIES_DIR/critical.html" "code-blocks.html" "💻" "Code Blocks" "Learn programming with blocks!" 3

# Add Fraction Pizza to Math & Logic
add_game_to_category "$CATEGORIES_DIR/math.html" "fraction-pizza.html" "🍕" "Fraction Pizza" "Learn fractions with pizza slices!" 3

# Add Geography Explorer to General Knowledge
add_game_to_category "$CATEGORIES_DIR/knowledge.html" "geography-explorer.html" "🗺️" "Geography Explorer" "Explore countries and continents!" 3

# Add Mindfulness Breathing to Emotional & Social Skills
add_game_to_category "$CATEGORIES_DIR/emotional.html" "mindfulness-breathing.html" "🧘" "Mindfulness Breathing" "Practice calm breathing exercises!" 1

# Add Phonics Fun to Language
add_game_to_category "$CATEGORIES_DIR/language.html" "phonics-fun.html" "🔤" "Phonics Fun" "Learn letter sounds and blends!" 2

# Add Rhythm Dance to Motor Skills
add_game_to_category "$CATEGORIES_DIR/motor.html" "rhythm-dance.html" "💃" "Rhythm Dance" "Dance to the beat and follow arrows!" 3

# Add Typing Tutor to Motor Skills
add_game_to_category "$CATEGORIES_DIR/motor.html" "typing-tutor.html" "⌨️" "Typing Tutor" "Learn to type with proper technique!" 2

echo ""
echo "🎉 Category update completed!"
echo ""
echo "📝 Summary of changes:"
echo "   • Added Bridge Builder to Critical Thinking (4 stars)"
echo "   • Added Code Blocks to Critical Thinking (3 stars)" 
echo "   • Added Fraction Pizza to Math & Logic (3 stars)"
echo "   • Added Geography Explorer to General Knowledge (3 stars)"
echo "   • Added Mindfulness Breathing to Emotional & Social Skills (1 star)"
echo "   • Added Phonics Fun to Language (2 stars)"
echo "   • Added Rhythm Dance to Motor Skills (3 stars)"
echo "   • Added Typing Tutor to Motor Skills (2 stars)"
echo ""
echo "💾 Backup files created with timestamp suffix"
echo "🔍 Please review the updated category files to ensure proper formatting"
echo ""
echo "✨ KidZone is now fully organized! 🎮"