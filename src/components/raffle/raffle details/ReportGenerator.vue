<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
import jsPDF from 'jspdf'

const props = defineProps({
    raffle: {
        type: Object,
        required: true
    },
    distributions: {
        type: Array,
        required: true
    }
})

const isOpen = ref(false)
const dropdownRef = ref(null)

// Group distributions by item
const itemsWithWinners = computed(() => {
    const grouped = {}

    props.distributions.forEach(dist => {
        const itemId = dist.item.id

        if (!grouped[itemId]) {
            grouped[itemId] = {
                item: dist.item,
                winners: []
            }
        }

        grouped[itemId].winners.push({
            name: dist.member.name,
            quantity: dist.quantity
        })
    })

    return Object.values(grouped)
})

// Format report as text
const generateReportText = () => {
    const lines = []
    const separator = '═'.repeat(55)
    const divider = '─'.repeat(55)

    lines.push(separator)
    lines.push('         RAFFLE REPORT')
    lines.push(separator)
    lines.push('')
    lines.push(`Raffle: ${props.raffle.name}`)
    lines.push(`Date: ${formatDate(props.raffle.date)}`)
    lines.push(`Status: ${capitalize(props.raffle.status)}`)
    lines.push(`Total Participants: ${props.raffle.members?.length || 0}`)
    lines.push('')
    lines.push(divider)
    lines.push('WINNERS')
    lines.push(divider)
    lines.push('')

    if (itemsWithWinners.value.length === 0) {
        lines.push('No winners yet')
    } else {
        itemsWithWinners.value.forEach((itemData, index) => {
            const item = itemData.item
            const tradeableBadge = item.is_tradeable ? ' [Tradeable]' : ''

            lines.push(`[${capitalize(item.rarity)}] ${item.name}${tradeableBadge}`)

            itemData.winners.forEach(winner => {
                lines.push(`  • ${winner.name} ×${winner.quantity}`)
            })

            if (index < itemsWithWinners.value.length - 1) {
                lines.push('')
            }
        })
    }

    lines.push('')
    lines.push(divider)
    lines.push(`Generated: ${formatDateTime(new Date())}`)
    lines.push(separator)

    return lines.join('\n')
}

// Copy to clipboard
const copyToClipboard = async () => {
    try {
        const text = generateReportText()
        await navigator.clipboard.writeText(text)
        toast.success('Report copied to clipboard!')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to copy:', error)
        toast.error('Failed to copy report')
    }
}

// Print preview
const printPreview = () => {
    const text = generateReportText()
    const printWindow = window.open('', '_blank')

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Raffle Report - ${props.raffle.name}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          background: white;
          color: black;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 12px;
          line-height: 1.5;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <pre>${text}</pre>
    </body>
    </html>
  `)

    printWindow.document.close()

    // Auto-open print dialog
    printWindow.onload = () => {
        printWindow.print()
    }

    isOpen.value = false
}

// Download PDF
// Download PDF
const downloadPDF = () => {
    try {
        const doc = new jsPDF()

        // Use Helvetica instead of Courier (better character support)
        doc.setFont('helvetica')
        doc.setFontSize(10)

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 15
        const maxWidth = pageWidth - (margin * 2)
        const lineHeight = 6

        let y = margin

        // Helper to add text with page breaks
        const addText = (text, isBold = false) => {
            if (y + lineHeight > pageHeight - margin) {
                doc.addPage()
                y = margin
            }

            if (isBold) {
                doc.setFont('helvetica', 'bold')
            } else {
                doc.setFont('helvetica', 'normal')
            }

            doc.text(text, margin, y)
            y += lineHeight
        }

        // Header
        const separator = '='.repeat(55)
        const divider = '-'.repeat(55)

        addText(separator)
        addText('RAFFLE REPORT', true)
        addText(separator)
        addText('')
        addText(`Raffle: ${props.raffle.name}`)
        addText(`Date: ${formatDate(props.raffle.date)}`)
        addText(`Status: ${capitalize(props.raffle.status)}`)
        addText(`Total Participants: ${props.raffle.members?.length || 0}`)
        addText('')
        addText(divider)
        addText('WINNERS', true)
        addText(divider)
        addText('')

        // Winners
        if (itemsWithWinners.value.length === 0) {
            addText('No winners yet')
        } else {
            itemsWithWinners.value.forEach((itemData, index) => {
                const item = itemData.item
                const tradeableBadge = item.is_tradeable ? ' [Tradeable]' : ''

                addText(`[${capitalize(item.rarity)}] ${item.name}${tradeableBadge}`, true)

                itemData.winners.forEach(winner => {
                    addText(`  • ${winner.name} x${winner.quantity}`)
                })

                if (index < itemsWithWinners.value.length - 1) {
                    addText('')
                }
            })
        }

        // Footer
        addText('')
        addText(divider)
        addText(`Generated: ${formatDateTime(new Date())}`)
        addText(separator)

        const filename = `Raffle_Report_${props.raffle.name.replace(/\s+/g, '_')}_${formatDateForFilename(new Date())}.pdf`
        doc.save(filename)

        toast.success('PDF downloaded!')
        isOpen.value = false
    } catch (error) {
        console.error('Failed to generate PDF:', error)
        toast.error('Failed to generate PDF')
    }
}
// Helper functions
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatDateForFilename = (date) => {
    return date.toISOString().split('T')[0]
}

const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <!-- Main Button -->
        <button @click="isOpen = !isOpen"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Generate Report</span>
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown Menu -->
        <transition name="dropdown">
            <div v-if="isOpen"
                class="absolute left-0 mt-2 w-56 bg-[#1a1a1f] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                <button @click="downloadPDF"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left">
                        <div class="font-medium">Download PDF</div>
                        <div class="text-xs text-gray-400">Save as PDF file</div>
                    </div>
                </button>

                <button @click="printPreview"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors border-t border-gray-700">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <div class="text-left">
                        <div class="font-medium">Print Preview</div>
                        <div class="text-xs text-gray-400">Print or save to PDF</div>
                    </div>
                </button>

                <button @click="copyToClipboard"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors border-t border-gray-700">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div class="text-left">
                        <div class="font-medium">Copy to Clipboard</div>
                        <div class="text-xs text-gray-400">Paste anywhere</div>
                    </div>
                </button>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 150ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>