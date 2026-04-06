/**
 * Parse warehouse log text into structured data
 * @param {string} text - Raw warehouse log (tab or space-separated)
 * @returns {Array} Parsed items with aggregated quantities
 */
export function parseWarehouseLog(text) {
    if (!text || !text.trim()) {
        return []
    }

    const lines = text.trim().split('\n')
    const itemsMap = new Map()

    lines.forEach((line, index) => {
        // Try splitting by tab first, then fall back to multiple spaces
        let parts = line.split('\t')
        
        // If tab split didn't work well, try splitting by 2+ spaces
        if (parts.length < 2) {
            parts = line.split(/\s{2,}/)
        }

        // Skip if we still don't have enough parts
        if (parts.length < 2) {
            console.warn(`Line ${index + 1} skipped - invalid format:`, line)
            return
        }

        const itemName = parts[0]?.trim()
        const quantityStr = parts[1]?.trim()
        const quantity = parseInt(quantityStr) || 1
        const source = parts[2]?.trim() || 'Unknown'
        const timestamp = parts[3]?.trim() || null

        if (!itemName) {
            console.warn(`Line ${index + 1} skipped - no item name`)
            return
        }

        // Aggregate by item name
        if (itemsMap.has(itemName)) {
            const existing = itemsMap.get(itemName)
            existing.total += quantity
            existing.sources.push({ source, timestamp, quantity })
        } else {
            itemsMap.set(itemName, {
                gameName: itemName,
                total: quantity,
                detectedRarity: detectRarity(itemName),
                sources: [{ source, timestamp, quantity }]
            })
        }
    })

    return Array.from(itemsMap.values())
}

/**
 * Detect rarity from item name patterns
 * @param {string} itemName - Item name from game
 * @returns {string|null} Detected rarity or null
 */
function detectRarity(itemName) {
    // Explicit rarity tags
    const rarityMatch = itemName.match(/^\[([A-Z]+)\]/)
    if (rarityMatch) {
        const rarityCode = rarityMatch[1]
        const rarityMap = {
            'C': 'common',
            'UC': 'uncommon',
            'R': 'rare',
            'E': 'epic',
            'L': 'legendary'
        }
        return rarityMap[rarityCode] || null
    }

    // Horn exception (different pattern)
    if (itemName.toLowerCase().includes('horn')) {
        if (itemName.includes('Lesser')) return 'uncommon'
        if (itemName.includes('Middle')) return 'rare'
        if (itemName.includes('Higher')) return 'epic'
    }

    // Material patterns (general)
    if (itemName.includes('Lesser')) return 'common'
    if (itemName.includes('Middle')) return 'uncommon'
    if (itemName.includes('Higher')) return 'rare'
    if (itemName.includes('Superior')) return 'epic'

    // Gear tiers
    if (/Steel|Grim|Storm|Rune|Kari/.test(itemName)) {
        // Check if it's a material or gear
        if (/(Ring|Helmet|Gloves|Top|Boots|Spear|Sword|Bow|Necklace|Bracelet|Totem|Score|Lyra|Trap|Quartz)/.test(itemName)) {
            return 'rare'
        }
    }

    // Enhancement Tomes (usually uncommon)
    if (itemName.includes('Enhancement Tome')) return 'uncommon'

    // Blueprints
    if (itemName.includes('Blueprint')) {
        if (itemName.includes('Higher')) return 'epic'
        return 'epic' // Most blueprints are epic
    }

    return null // Unknown
}

/**
 * Match parsed items against existing database items
 * @param {Array} parsedItems - Items from parseWarehouseLog
 * @param {Array} dbItems - Items from database
 * @returns {Object} Categorized matches
 */
export function matchItems(parsedItems, dbItems) {
    const exactMatches = []
    const noMatches = []

    // Safety check - if no dbItems, everything is a no-match
    if (!dbItems || !Array.isArray(dbItems) || dbItems.length === 0) {
        console.warn('No database items provided for matching')
        return {
            exactMatches: [],
            noMatches: parsedItems
        }
    }

    parsedItems.forEach(parsed => {
        // Try exact name match
        const exactMatch = dbItems.find(db => 
            db.name.toLowerCase() === parsed.gameName.toLowerCase()
        )

        if (exactMatch) {
            exactMatches.push({
                ...parsed,
                matchedItem: exactMatch,
                matchType: 'exact'
            })
        } else {
            noMatches.push({
                ...parsed,
                matchType: 'none'
            })
        }
    })

    return {
        exactMatches,
        noMatches
    }
}

const parseLog = () => {
    if (!rawText.value.trim()) {
        toast.error('Please paste warehouse log data')
        return
    }

    try {
        const parsed = parseWarehouseLog(rawText.value)
        
        console.log('Parsed items:', parsed) // Debug log
        
        if (parsed.length === 0) {
            toast.error('No items detected. Make sure you copied the full log with tabs/spacing.')
            return
        }

        const matched = matchItems(parsed, props.existingItems)
        parsedItems.value = matched
        
        // Auto-select all exact matches
        selectedExactMatches.value = matched.exactMatches.map(item => item.gameName)
        
        step.value = 2
        toast.success(`Parsed ${parsed.length} items`)
    } catch (error) {
        console.error('Parse error:', error)
        toast.error('Failed to parse log. Check the format.')
    }
}