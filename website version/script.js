document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const hiLoValues = {
        '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
        '7': 0, '8': 0, '9': 0,
        '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
    };
    const cardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // Basic Strategy Action Constants
    const s = 'Stand';
    const h = 'Hit';
    const dh = 'Double if allowed otherwise Hit';
    const ds = 'Double if allowed otherwise Stand';
    const p = 'Split';
    const ph = 'split if double after splits is allowed, otherwise hit';
    const pd = 'split if double after splits is allowed, otherwise double';
    const sh = 'stand, otherwise hit';
    const A = 'A'; // Represent Ace for strategy table keys

    // --- STRATEGY TABLES ---

    // Default strategy table for Multi-Deck (2+ decks)
    const strategyTableMultiDeck = {
        "hard": {
            21:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            20:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            19:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            18:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            17:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            16:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            15:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            14:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            13:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            12:{ 2:h, 3:h, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            11:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:dh, A:dh},
            10:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:h, A:h},
             9:{ 2:h, 3:dh, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key from "9:" to 9:
             8:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key
             7:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key
             6:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key
             5:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h}  // Corrected key
            },
        "soft": {
            21:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            20:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            19:{ 2:s, 3:s, 4:s, 5:s, 6:ds, 7:s, 8:s, 9:s, 10:s, A:s},
            18:{ 2:ds, 3:ds, 4:ds, 5:ds, 6:ds, 7:s, 8:s, 9:h, 10:h, A:h},
            17:{ 2:h, 3:dh, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            16:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            15:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            14:{ 2:h, 3:h, 4:h, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            13:{ 2:h, 3:h, 4:h, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            },
        "pairs":{
             A:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:p, 9:p, 10:p, A:p}, // Corrected key
            10:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
             9:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:s, 8:p, 9:p, 10:s, A:s}, // Corrected key
             8:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:p, 9:p, 10:p, A:p}, // Corrected key
             7:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:h, 9:h, 10:h, A:h}, // Corrected key
             6:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key
             5:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:h, A:h}, // Corrected key
             4:{ 2:h, 3:h, 4:h, 5:p, 6:p, 7:h, 8:h, 9:h, 10:h, A:h}, // Corrected key
             3:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:h, 9:h, 10:h, A:h}, // Corrected key
             2:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:h, 9:h, 10:h, A:h}, // Corrected key
            }
    };

    // Strategy table for Single Deck (totalDecks = 1) - Using placeholder values, replace with accurate SD strategy
    const strategyTableSingleDeck = {
         "hard": {
            21:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            20:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            19:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            18:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            17:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:h}, // SD diff vs A
            16:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            15:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            14:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            13:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            12:{ 2:h, 3:h, 4:s, 5:s, 6:s, 7:h, 8:h, 9:h, 10:h, A:h},
            11:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:dh, A:dh }, // SD diff vs A
            10:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:h, A:h },
             9:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h }, // SD diff vs 2
             8:{ 2:h, 3:h, 4:h, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h }, // SD diff vs 5, 6
             7:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h },
             6:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h },
             5:{ 2:h, 3:h, 4:h, 5:h, 6:h, 7:h, 8:h, 9:h, 10:h, A:h }
            },
        "soft": {
            21:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            20:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
            19:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s}, // SD diff vs 6
            18:{ 2:s, 3:ds, 4:ds, 5:ds, 6:ds, 7:s, 8:s, 9:h, 10:h, A:h}, // SD diff vs 2
            17:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h}, // SD diff vs 2
            16:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            15:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h},
            14:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h}, // SD diff vs 4
            13:{ 2:h, 3:h, 4:dh, 5:dh, 6:dh, 7:h, 8:h, 9:h, 10:h, A:h}, // SD diff vs 4
            },
        "pairs":{
             A:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:p, 9:p, 10:p, A:p},
            10:{ 2:s, 3:s, 4:s, 5:s, 6:s, 7:s, 8:s, 9:s, 10:s, A:s},
             9:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:s, 8:p, 9:p, 10:s, A:s},
             8:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:p, 9:p, 10:p, A:p}, // Often split 8v10/A in SD
             7:{ 2:p, 3:p, 4:p, 5:p, 6:p, 7:p, 8:ph, 9:h, 10:s, A:h}, // Often Stand 7v10 in SD
             6:{ 2:ph, 3:p, 4:p, 5:p, 6:p, 7:h, 8:h, 9:h, 10:h, A:h}, // SD diff vs 2, 7
             5:{ 2:dh, 3:dh, 4:dh, 5:dh, 6:dh, 7:dh, 8:dh, 9:dh, 10:h, A:h},
             4:{ 2:h, 3:h, 4:ph, 5:ph, 6:ph, 7:h, 8:h, 9:h, 10:h, A:h}, // SD diff vs 4,5,6
             3:{ 2:ph, 3:ph, 4:p, 5:p, 6:p, 7:p, 8:ph, 9:h, 10:h, A:h}, // SD diff vs 2,3,8
             2:{ 2:ph, 3:ph, 4:p, 5:p, 6:p, 7:p, 8:h, 9:h, 10:h, A:h}, // SD diff vs 2,3
            }
    };

    // Illustrious 18 Deviations
    const i18Deviations = {
        "16v9":{threshold:5, comparison:'≥', action: s},
        "16v10": { threshold: 0, comparison: '≥', action: s },
        "15v10": { threshold: 4, comparison: '≥', action: s },
        "13v2":  { threshold: -1, comparison: '≥', action: sh },
        "13v3":  { threshold: -2, comparison: '≥', action: sh },
        "12v2":  { threshold: 4, comparison: '≥', action: s },
        "12v3":  { threshold: 2, comparison: '≥', action: s },
        "12v4":  { threshold: 0, comparison: '≥', action: s },
        "12v5":  { threshold: -1, comparison: '≥', action: sh },
        "12v6":  { threshold: -1, comparison: '≥', action: sh },
        "11vA":  { threshold: 1, comparison: '≥', action: dh }, // Key uses A constant
        "10v10": { threshold: 4, comparison: '≥', action: dh },
        "10vA":  { threshold: 4, comparison: '≥', action: dh }, // Key uses A constant
        "9v2":   { threshold: 1, comparison: '≥', action: dh },
        "9v7":   { threshold: 4, comparison: '≥', action: dh },
        "10,10v5": { threshold: 5, comparison: '≥', action: p },
        "10,10v6": { threshold: 5, comparison: '≥', action: p },
    };
    

    // Game State Variables
    let runningCount = 0;
    let cardsSeen = 0;
    let totalDecks = parseInt(document.getElementById('deck-count').value) || 8;
    const cardsPerDeck = 52;

    let dealerCard = null;
    let playerCards = [];
    let otherCards = [];
    let splitHands = [];
    let activeSplitHandIndex = -1; // -1 means main hand, 0 means first split hand, 1 means second
    let activeSection = 'player'; // 'dealer', 'player', 'others'

    // --- DOM Elements ---
    const cardSelectorDiv = document.getElementById('card-selector');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');
    const otherCardsDiv = document.getElementById('other-cards');
    const runningCountSpan = document.getElementById('running-count');
    const cardsSeenSpan = document.getElementById('cards-seen');
    const decksRemainingSpan = document.getElementById('decks-remaining');
    const trueCountSpan = document.getElementById('true-count');
    const suggestedMoveSpan = document.getElementById('suggested-move');
    const deviationInfoSpan = document.getElementById('deviation-info'); // Span for deviation text
    const playerHandValueSpan = document.getElementById('player-hand-value');
    const deckCountInput = document.getElementById('deck-count');
    const resetHandButton = document.getElementById('reset-hand-button');
    const resetAllButton = document.getElementById('reset-all-button');
    const dealerSectionDiv = document.getElementById('dealer-section');
    const playerSectionDiv = document.getElementById('player-section');
    const othersSectionDiv = document.getElementById('others-section');
    const splitButton = document.getElementById('split-button');
    const splitInfoP = document.getElementById('split-info');
    const nextHandButton = document.getElementById('next-hand-button');


    // --- Core Logic Functions ---

    /**
     * Calculates the total value of a hand and if it's soft.
     * @param {string[]} hand - Array of card ranks (e.g., ['A', '6']).
     * @returns {{total: number, isSoft: boolean}}
     */
    function calculateHandValue(hand) {
        if (!Array.isArray(hand)) { return { total: 0, isSoft: false }; }
        let total = 0;
        let aces = 0;
        hand.forEach(card => {
            if (!card) return; // Skip if card is somehow null/undefined
            if (['J', 'Q', 'K', '10'].includes(card)) {
                total += 10;
            } else if (card === 'A') {
                aces += 1;
                total += 11;
            } else {
                const val = parseInt(card);
                if (!isNaN(val)) {
                    total += val;
                }
            }
        });
        // Adjust for Aces if total is over 21
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }
        return { total: total, isSoft: (aces > 0 && total <= 21) }; // isSoft is true only if an Ace is counting as 11
    }

    /**
     * Normalizes a card rank for strategy table lookup.
     * Returns 'A' for Ace, 10 for T/J/Q/K, or the numeric value.
     * @param {string} card - Card rank ('A', 'K', '7', etc.).
     * @returns {number|string|null} - The key for the strategy table (A, 2-10) or null if invalid.
     */
    function normalizeDealerRank(card) {
        if (card === 'A') return A; // Use the 'A' constant
        if (['K', 'Q', 'J', '10'].includes(card)) return 10;
        const numValue = parseInt(card);
        // Ensure it's a valid card rank (2-9)
        return (!isNaN(numValue) && numValue >= 2 && numValue <= 9) ? numValue : null;
    }

    /**
     * Determines the Basic Strategy move for a given hand and dealer upcard.
     * @param {string[]} currentHand - Player's current hand.
     * @param {string} dealerUpCard - Dealer's visible card.
     * @returns {string} - The suggested basic strategy move (e.g., 'Hit', 'Stand').
     */
    function getMove(currentHand, dealerUpCard) {
        if (!dealerUpCard || !Array.isArray(currentHand) || currentHand.length === 0) {
            return "-"; // Cannot determine move
        }

        // Select the correct strategy table based on deck count
        const selectedTable = (totalDecks === 1) ? strategyTableSingleDeck : strategyTableMultiDeck;

        const dealerKey = normalizeDealerRank(dealerUpCard);
        // Validate dealer key
        if (dealerKey === null) { // Removed check against A constant here as normalizeDealerRank handles it
            console.warn("Invalid dealer card for strategy lookup:", dealerUpCard);
            return "Invalid Dealer Card";
        }

        const { total, isSoft } = calculateHandValue(currentHand);

        if (total > 21) return "Bust";
        if (total === 21) return s; // Stand on 21

        // Check Pairs first (only if exactly 2 cards and they match rank)
        if (currentHand.length === 2 && currentHand[0] === currentHand[1]) {
            // Need to normalize the player's pair card rank for lookup
            const pairRankKey = normalizeDealerRank(currentHand[0]); // Can reuse normalizeDealerRank
            if (pairRankKey !== null && selectedTable.pairs.hasOwnProperty(pairRankKey)) {
                // Check if the specific dealer card key exists for this pair
                if (selectedTable.pairs[pairRankKey].hasOwnProperty(dealerKey)) {
                    return selectedTable.pairs[pairRankKey][dealerKey];
                } else {
                    console.warn(`Dealer key ${dealerKey} not found for pair ${pairRankKey}. Defaulting to Hit.`);
                    return h; // Default to Hit if specific dealer key is missing for the pair
                }
            }
        }

        // Check Soft Hands (if not a pair or pair lookup failed, and hand is soft and not 21)
        if (isSoft && total < 21) {
            if (selectedTable.soft.hasOwnProperty(total)) {
                if (selectedTable.soft[total].hasOwnProperty(dealerKey)) {
                    return selectedTable.soft[total][dealerKey];
                } else {
                    console.warn(`Dealer key ${dealerKey} not found for soft total ${total}. Defaulting to Hit.`);
                    return h; // Default to Hit if specific dealer key is missing
                }
            }
        }

        // Default: Hard Hands (or soft hands that became hard or weren't found in soft table)
        // Use the calculated total, capped at 21 for table lookup keys if needed (e.g., >=17 often play the same)
        const hardTotalKey = Math.min(total, 21); // Example: Cap lookup at 17 if 17+ are the same vs dealer cards
                                                // Adjust this cap based on how your table keys are structured (e.g., use 21 if you have entries up to 21)
                                                // Based on your table, keys go up to 21, so use Math.min(total, 21)
   
        const finalHardKey = Math.min(total, 21); // Use the actual total, capped if necessary (though 21 is handled earlier)

        if (selectedTable.hard.hasOwnProperty(finalHardKey)) {
            if (selectedTable.hard[finalHardKey].hasOwnProperty(dealerKey)) {
                return selectedTable.hard[finalHardKey][dealerKey];
            } else {
                console.warn(`Dealer key ${dealerKey} not found for hard total ${finalHardKey}. Defaulting to Hit.`);
                return h; // Default to Hit
            }
        }

        // Fallback if no strategy found (should ideally not happen with complete tables)
        console.warn(`Could not find strategy for total: ${total}, isSoft: ${isSoft}, dealer: ${dealerKey} in selected table ${totalDecks === 1 ? 'Single Deck' : 'Multi Deck'}. Defaulting to Hit.`);
        return h;
    }

    /** Updates the display of Running Count, Cards Seen, Decks Remaining, True Count. */
    function updateCounts() {
        // Ensure cardsSeen doesn't exceed total cards
        const maxCards = totalDecks * cardsPerDeck;
        cardsSeen = Math.min(cardsSeen, maxCards);

        const cardsRemaining = maxCards - cardsSeen;
        // Calculate decks remaining, ensuring it's at least a small fraction (e.g., 0.01) to avoid division by zero
        // A more common approach is to use minimums like 0.5 or 1 deck depending on estimation method. Let's use 0.25 for sensitivity.
        const decksRemaining = Math.max(cardsRemaining / cardsPerDeck, 0.25);
        // Calculate true count, handle division by zero or near-zero decks remaining
        const trueCount = (decksRemaining > 0) ? (runningCount / decksRemaining) : 0;

        runningCountSpan.textContent = runningCount;
        cardsSeenSpan.textContent = cardsSeen;
        decksRemainingSpan.textContent = decksRemaining.toFixed(2);
        trueCountSpan.textContent = trueCount.toFixed(2);
    }

    /**
     * Displays card images in the specified container.
     * @param {string[]} cardArray - Array of card ranks to display.
     * @param {HTMLElement} containerDiv - The container element to display cards in.
     */
    function displayCards(cardArray, containerDiv) {
        containerDiv.innerHTML = ''; // Clear previous cards
        if (!Array.isArray(cardArray)) return;

        cardArray.forEach((card, index) => {
             if (!card) return; // Skip null/undefined cards

            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'displayed-card');
            // Store rank and index for potential deletion
            cardElement.dataset.rank = card;
            cardElement.dataset.index = index;

            const img = document.createElement('img');
            // Assuming images are in an 'images' subfolder and named like 'A.png', 'K.png', '7.png'
            img.src = `images/${card}.png`;
            img.alt = `Card ${card}`; // Alt text for accessibility
            img.onerror = () => {
                // Fallback if image fails to load
                cardElement.textContent = card;
                console.error(`Failed to load image: images/${card}.png`);
            };
            cardElement.appendChild(img);

            // Add delete icon ('×')
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '×'; // Multiplication sign looks like 'x'
            deleteIcon.title = 'Delete this card'; // Tooltip
            cardElement.appendChild(deleteIcon);

            containerDiv.appendChild(cardElement);
        });
    }

    /**
     * Removes a card from the specified hand/area and updates counts/display.
     * @param {string} containerId - ID of the container ('dealer-cards', 'player-cards', 'other-cards').
     * @param {number} index - Index of the card to remove within its array.
     * @param {string} rank - Rank of the card to remove (for verification and count adjustment).
     */
    function removeCardFromHand(containerId, index, rank) {
        console.log(`Attempting to remove card: rank=${rank}, index=${index} from container=${containerId}`);
        if (rank === undefined || index === undefined || index < 0) {
            console.error("Invalid parameters for removeCardFromHand");
            return;
        }

        let handChanged = false;
        let targetArray = null;
        let removedCard = null; // Store the rank of the removed card
        let isSplit = activeSplitHandIndex !== -1;

        // Determine the correct array/card to modify
        if (containerId === 'dealer-cards') {
            if (dealerCard === rank) { // Dealer only has one card tracked this way
                removedCard = dealerCard;
                dealerCard = null; // Clear the dealer card state variable
                handChanged = true;
            } else {
                console.error("Mismatch deleting dealer card. Expected:", dealerCard, "Got:", rank);
                return; // Don't proceed if rank doesn't match
            }
        } else if (containerId === 'player-cards') {
            if (isSplit) {
                // Ensure the target split hand exists
                if (activeSplitHandIndex < splitHands.length && splitHands[activeSplitHandIndex]) {
                    targetArray = splitHands[activeSplitHandIndex];
                } else {
                    console.error("Invalid split hand state for deletion.");
                    return; // Cannot find target array
                }
            } else {
                targetArray = playerCards; // Target the main player hand
            }
        } else if (containerId === 'other-cards') {
            targetArray = otherCards;
        } else {
             console.error("Unknown containerId for removal:", containerId);
             return; // Unknown area
        }

        // If targetArray is set (i.e., player or other cards), perform splice
        if (targetArray) {
            if (index < targetArray.length && targetArray[index] === rank) {
                // Remove the card from the array, getting the removed card rank
                removedCard = targetArray.splice(index, 1)[0];
                handChanged = true;

                // Log if a split hand becomes empty
                if (isSplit && containerId === 'player-cards' && targetArray.length === 0) {
                    console.log(`Split hand ${activeSplitHandIndex + 1} is now empty.`);
                }
            } else {
                 // This case should ideally not happen if index/rank come from the element's dataset correctly
                console.error(`Mismatch or index out of bounds deleting card from ${containerId}: index=${index}, rank=${rank}, array=`, targetArray);
                return; // Exit if we can't find the card to remove
            }
        }

        // Adjust counts if a card was successfully identified and removed
        if (handChanged && removedCard) {
            if (hiLoValues.hasOwnProperty(removedCard)) {
                runningCount -= hiLoValues[removedCard];
                cardsSeen -= 1;
                cardsSeen = Math.max(0, cardsSeen); // Ensure cardsSeen doesn't go below 0
                console.log(`Counts adjusted: RC=${runningCount}, Seen=${cardsSeen}`);
            } else {
                // This shouldn't happen if card ranks are always valid
                 console.warn("Could not find count value for deleted card rank:", removedCard);
            }
        }


        // Update UI if the hand state changed
        if (handChanged) {
            console.log("Hand changed, updating UI.");
            let arrayToDisplay;
            let targetDiv;

            // Determine which div and array to re-render
            if (containerId === 'dealer-cards') {
                // Display the single dealer card (or nothing if null)
                arrayToDisplay = dealerCard ? [dealerCard] : [];
                targetDiv = dealerCardsDiv;
            } else if (containerId === 'player-cards') {
                 // Display the currently active player hand (split or main)
                arrayToDisplay = isSplit ? (splitHands[activeSplitHandIndex] || []) : playerCards;
                targetDiv = playerCardsDiv;
            } else if (containerId === 'other-cards') {
                arrayToDisplay = otherCards;
                targetDiv = otherCardsDiv;
            }

            // Re-display the cards for the affected container
            if (targetDiv) {
                 displayCards(arrayToDisplay, targetDiv); // Pass the correct array
            }

            // Update counts and strategy display after modifying the hand
            updateCounts();
            updateStrategyDisplay();
        } else {
            // This might happen if there was an error before handChanged was set to true
            console.log("No hand change detected or error occurred during removal attempt.");
        }
    }

    /** Updates the displayed suggested move and deviation info based on the current hand. */
    function updateStrategyDisplay() {
        let currentHand = activeSplitHandIndex !== -1 ? (splitHands[activeSplitHandIndex] || []) : playerCards;
        let handLabel = "My Hand";
        let showNextHandBtn = false;

        // --- Logic to determine handLabel and showNextHandBtn for splits ---
        if (activeSplitHandIndex !== -1) {
            if(splitHands && splitHands.length > activeSplitHandIndex) {
                handLabel = `Split Hand ${activeSplitHandIndex + 1}`;
                splitInfoP.textContent = `Playing ${handLabel}`;
                splitInfoP.classList.remove('hidden');
                // Show 'Next Hand' button only when on the first hand of a multi-hand split
                if (activeSplitHandIndex === 0 && splitHands.length > 1) {
                    showNextHandBtn = true;
                }
            } else {
                // Handle potential error state if split index is invalid
                console.error("Error accessing invalid split hand index:", activeSplitHandIndex);
                activeSplitHandIndex = -1; // Reset to main hand
                splitInfoP.classList.add('hidden');
                currentHand = playerCards; // Fallback to main player hand
            }
        } else {
            splitInfoP.classList.add('hidden'); // Hide split info if not splitting
        }
        // --- End handLabel/showNextHandBtn logic ---

        // Ensure currentHand is always a valid array
        if (!Array.isArray(currentHand)) {
            console.error("currentHand is not an array:", currentHand);
            currentHand = []; // Recover by setting to empty array
        }

        const handValueResult = calculateHandValue(currentHand);
        let basicMove = '-'; // Default display for basic strategy
        let deviationText = '-'; // Default display for deviation info

        // Only calculate moves if there are player cards and a dealer card
        if (currentHand.length > 0 && dealerCard) {
            // 1. Get Basic Strategy Move
            basicMove = getMove(currentHand, dealerCard);

            // --- Start Deviation Calculation ---
            const dealerKey = normalizeDealerRank(dealerCard);
            let deviationInfoTextParts = []; // Array to hold deviation strings

            if (dealerKey !== null) {
                let deviationKey = null;

                // --- Construct the deviation key based on hand type ---
                // Check Pair Deviations first (only 10,10 in the provided list)
                if (currentHand.length === 2 && currentHand[0] === currentHand[1]) {
                    const cardRank = normalizeDealerRank(currentHand[0]);
                    if (cardRank === 10) { // Explicitly check for 10,10 vs dealer
                        deviationKey = `10,10v${dealerKey}`;
                    }
                    // Add checks here if other pairs were in i18 (e.g., "5,5vX")
                }

                // If not a handled pair deviation, check hard/soft totals (if hand is not bust)
                if (!deviationKey && handValueResult.total <= 21) {
                     // Use the hand's total value. Keys like "16v10", "11vA", etc.
                     deviationKey = `${handValueResult.total}v${dealerKey}`;
                }
                // --- End key construction ---


                // --- Check if the constructed key exists in i18Deviations ---
                if (deviationKey && i18Deviations.hasOwnProperty(deviationKey)) {
                    const deviationInfo = i18Deviations[deviationKey];
                    const { threshold, comparison, action: deviationAction } = deviationInfo;
                    // Format the text: "Action if TC comparison threshold"
                    deviationInfoTextParts.push(`${deviationAction} if TC ${comparison} ${threshold}`);
                }
                // --- End deviation check ---

                // 3. Check for Insurance applicability (separate check if dealer shows Ace)
                if (dealerCard === 'A') {
                     deviationInfoTextParts.push(`Insurance if TC >= ${insuranceThreshold}`);
                }
            } // End if (dealerKey !== null)

            // Combine deviation text parts with " | " or set to '-' if none found
             deviationText = deviationInfoTextParts.length > 0 ? deviationInfoTextParts.join(" | ") : '-';
            // --- End Deviation Calculation ---

        } // End if (currentHand.length > 0 && dealerCard)

        // 4. Update the DOM
        suggestedMoveSpan.textContent = basicMove; // Display the calculated basic strategy
        deviationInfoSpan.textContent = deviationText; // Display deviation info (or '-')
        // Update player hand value display
        playerHandValueSpan.textContent = handValueResult.total > 0 || currentHand.length > 0
            ? `${handValueResult.total} (${handLabel})` // Show total if > 0 or if hand has cards (even if total is 0 temporarily)
            : '-'; // Show '-' if hand is empty


        // --- Update Split Button state ---
        // Can split only if main hand has 2 cards, they match, not already splitting, and dealer card exists
        const canSplit = playerCards.length === 2 && playerCards[0] === playerCards[1] && activeSplitHandIndex === -1 && dealerCard;
        splitButton.disabled = !canSplit;
        splitButton.classList.toggle('hidden', activeSplitHandIndex !== -1); // Hide if already splitting
        nextHandButton.classList.toggle('hidden', !showNextHandBtn); // Show only when needed
        // --- End Split Button logic ---
    }

    /**
     * Adds a card to the currently active section (dealer, player, others).
     * @param {string} rank - The rank of the card to add.
     */
    function addCard(rank) {
         if (!rank || !hiLoValues.hasOwnProperty(rank)) {
             console.error("Invalid card rank to add:", rank);
             return; // Exit if rank is invalid
         }

         // Update counts FIRST
         runningCount += hiLoValues[rank];
         cardsSeen += 1;

         let handUpdated = false; // Flag to track if a card was successfully added

         if (activeSection === 'dealer') {
             if (!dealerCard) { // Only allow one dealer card
                 dealerCard = rank;
                 displayCards([dealerCard], dealerCardsDiv); // Display the single card
                 handUpdated = true;
             } else {
                 // REVERT counts if dealer card already exists
                 runningCount -= hiLoValues[rank];
                 cardsSeen -= 1;
                 alert("Dealer upcard already set. Reset hand or delete the existing card first.");
            }
         }
         else if (activeSection === 'player') {
             if (activeSplitHandIndex !== -1) { // Handling split hand
                // Check if the target split hand array exists
                if (splitHands[activeSplitHandIndex]) {
                    splitHands[activeSplitHandIndex].push(rank);
                    displayCards(splitHands[activeSplitHandIndex], playerCardsDiv);
                    handUpdated = true;
                } else {
                    console.error("Trying to add to invalid split hand index:", activeSplitHandIndex);
                    // REVERT counts if error occurred
                    runningCount -= hiLoValues[rank];
                    cardsSeen -= 1;
                }
             } else { // Handling main player hand
                 playerCards.push(rank);
                 displayCards(playerCards, playerCardsDiv);
                 handUpdated = true;
             }
         }
         else if (activeSection === 'others') {
             otherCards.push(rank);
             displayCards(otherCards, otherCardsDiv);
             handUpdated = true; // 'Others' cards always update counts
         }

         // Update displays only if a card was successfully added to a hand
         if (handUpdated) {
             updateCounts(); // Update RC/TC display
             updateStrategyDisplay(); // Update suggested move and deviation info
         } else {
              // If hand wasn't updated (e.g., dealer full, split error), still update counts display
              // as counts might have been reverted.
              updateCounts();
              console.log("Card not added to a hand section (or error occurred). Counts potentially reverted.");
         }
    }

     /** Handles the logic for splitting a pair. */
     function handleSplit() {
         if (splitButton.disabled) return; // Extra check

         // Validate conditions again (redundant with button state but safe)
         if (playerCards.length !== 2 || playerCards[0] !== playerCards[1] || activeSplitHandIndex !== -1 || !dealerCard) {
             console.warn("Split conditions not met. Button should be disabled.");
             return;
         }

         const cardToSplit = playerCards[0];
         // Create two new hands, each with one of the split cards
         splitHands = [[cardToSplit], [cardToSplit]];
         playerCards = []; // Clear the original player hand
         activeSplitHandIndex = 0; // Start playing the first split hand

         displayCards(splitHands[0], playerCardsDiv); // Show the first split hand
         setActiveSection('player'); // Ensure player section remains active
         updateStrategyDisplay(); // Update strategy display for the new hand
         alert(`Split ${cardToSplit}s! Now playing Hand 1. Add card or click 'Play Next Split Hand'.`);
    }

     /** Switches focus to the next split hand if applicable. */
     function switchSplitHand() {
         // Can only switch from hand 1 (index 0) to hand 2 (index 1)
         if (activeSplitHandIndex === 0 && splitHands && splitHands.length > 1) {
             activeSplitHandIndex = 1;
             // Display the second hand, ensure it exists
             if (splitHands[activeSplitHandIndex]) {
                 displayCards(splitHands[activeSplitHandIndex], playerCardsDiv);
             } else {
                 // Should not happen if split created correctly
                 console.error("Second split hand is missing or invalid.");
                 playerCardsDiv.innerHTML = ''; // Clear display
             }
             updateStrategyDisplay(); // Update strategy for the second hand
             alert("Switched to Split Hand 2. Add next card for Hand 2.");
         }
         else if (activeSplitHandIndex === 1) {
             // We just finished the second hand
             alert("Finished playing Split Hand 2. Reset hand for next round.");
             // Optionally reset state here or just leave it for manual reset
             // Resetting back to non-split state:
             // activeSplitHandIndex = -1;
             // splitHands = [];
             // displayCards(playerCards, playerCardsDiv); // Display empty main hand
             // updateStrategyDisplay();
             // Let's just inform the user for now.
         }
         else {
             console.log("Cannot switch split hand (not splitting or already on second hand).");
         }
     }

    /** Resets the current hand state (dealer, player, others, splits) but keeps counts. */
    function resetHand() {
        console.log(`Resetting Hand. Counts Before: RC=${runningCount}, Seen=${cardsSeen}`);

        // Clear card state variables
        dealerCard = null;
        playerCards = [];
        otherCards = [];
        splitHands = [];
        activeSplitHandIndex = -1; // Back to main hand

        // Clear card display areas
        dealerCardsDiv.innerHTML = '';
        playerCardsDiv.innerHTML = '';
        otherCardsDiv.innerHTML = '';

        // Reset UI elements related to hand state
        splitInfoP.classList.add('hidden');
        splitInfoP.textContent = '';
        deviationInfoSpan.textContent = '-'; // Clear deviation info
        playerHandValueSpan.textContent = '-';
        suggestedMoveSpan.textContent = '-';

        // Update button states and active section
        splitButton.disabled = true;
        nextHandButton.classList.add('hidden');
        setActiveSection('player'); // Default back to player section

        // Update strategy display (which will now show defaults)
        updateStrategyDisplay();

        console.log(`Hand Reset. Counts After: RC=${runningCount}, Seen=${cardsSeen} (Counts are NOT reset)`);
    }

    /** Resets everything, including counts and deck settings, for a new shoe. */
    function resetAll() {
        console.log("Full Reset (New Shoe) Initiated.");
        runningCount = 0;
        cardsSeen = 0;

        // Re-read deck count from input in case it was changed
        totalDecks = parseInt(deckCountInput.value) || 8;
        console.log(`Resetting with ${totalDecks} decks.`);

        resetHand(); // Reset the hand state and associated UI elements

        updateCounts(); // Update counts display to 0 / initial state

        alert("Tracker reset for a new shoe.");
    }

     /**
      * Sets the currently active section for card input.
      * @param {string} sectionId - 'dealer', 'player', or 'others'.
      */
     function setActiveSection(sectionId) {
        // Remove 'active' class from all sections first
        [dealerSectionDiv, playerSectionDiv, othersSectionDiv].forEach(div => {
            if (div) div.classList.remove('active');
        });

        let targetDiv = null;
        if (sectionId === 'dealer') {
            targetDiv = dealerSectionDiv;
        } else if (sectionId === 'player') {
            targetDiv = playerSectionDiv;
        } else if (sectionId === 'others') {
            targetDiv = othersSectionDiv;
        }

        // Set the new active section
        if (targetDiv) {
            targetDiv.classList.add('active');
            activeSection = sectionId;
        } else {
            // Default to player section if somehow invalid sectionId is passed
            console.warn("Invalid sectionId passed to setActiveSection, defaulting to 'player'.");
            playerSectionDiv.classList.add('active');
            activeSection = 'player';
        }
        console.log("Active section set to:", activeSection);
     }


    // --- Event Listeners Setup ---

    // 1. Create Card Selector Buttons
    if (cardSelectorDiv) {
        cardRanks.forEach(rank => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'selector-card');
            cardElement.dataset.rank = rank; // Store rank for the click handler

            const img = document.createElement('img');
            img.src = `images/${rank}.png`;
            img.alt = rank;
            img.onerror = () => { cardElement.textContent = rank; }; // Fallback text
            cardElement.appendChild(img);

            // Add click listener to each selector card
            cardElement.addEventListener('click', () => {
                if (activeSection) {
                    addCard(rank); // Add the card corresponding to this button
                } else {
                    // Should not happen if setActiveSection works on init
                    alert("Please click on the Dealer, Player, or Others section first to select where to add the card.");
                }
            });
            cardSelectorDiv.appendChild(cardElement);
        });
    } else {
        console.error("Card selector container div not found!");
    }


    // 2. Set Active Input Section on Click
    if (dealerSectionDiv) dealerSectionDiv.addEventListener('click', () => setActiveSection('dealer'));
    if (playerSectionDiv) playerSectionDiv.addEventListener('click', (e) => {
         // Prevent setting active section if a button *inside* the section was clicked
         if (e.target.closest('button')) return;
         setActiveSection('player');
    });
    if (othersSectionDiv) othersSectionDiv.addEventListener('click', () => setActiveSection('others'));

    // 3. Event Listeners for Deleting Cards (using event delegation)
    function handleDeleteClick(e, containerId) {
        // Check if the click target or its parent is a delete icon
        const targetIcon = e.target.closest('.delete-icon');
        if (targetIcon) {
            // Find the parent card element
            const cardElement = targetIcon.closest('.displayed-card');
            if (cardElement && cardElement.dataset.rank !== undefined && cardElement.dataset.index !== undefined) {
                const rank = cardElement.dataset.rank;
                const index = parseInt(cardElement.dataset.index, 10);
                // Ensure index is a valid number before calling remove function
                if (!isNaN(index)) {
                    removeCardFromHand(containerId, index, rank);
                } else {
                    console.error("Invalid index found on card element:", cardElement.dataset.index);
                }
            } else {
                console.error("Could not find card data on parent element for delete icon:", cardElement);
            }
        }
    }
    // Attach listeners to the containers
    if (dealerCardsDiv) dealerCardsDiv.addEventListener('click', (e) => handleDeleteClick(e, 'dealer-cards'));
    if (playerCardsDiv) playerCardsDiv.addEventListener('click', (e) => handleDeleteClick(e, 'player-cards'));
    if (otherCardsDiv) otherCardsDiv.addEventListener('click', (e) => handleDeleteClick(e, 'other-cards'));

    // 4. Button Listeners
    if (resetHandButton) resetHandButton.addEventListener('click', resetHand);
    if (resetAllButton) resetAllButton.addEventListener('click', resetAll);
    if (splitButton) splitButton.addEventListener('click', handleSplit);
    if (nextHandButton) nextHandButton.addEventListener('click', switchSplitHand);

    // 5. Deck Count Change Listener
    if (deckCountInput) {
        deckCountInput.addEventListener('change', () => {
            const newDeckCount = parseInt(deckCountInput.value);
            if (!isNaN(newDeckCount) && newDeckCount > 0 && newDeckCount <= 10) { // Added upper limit sanity check
                 const oldDeckCount = totalDecks;
                 totalDecks = newDeckCount;
                 console.log(`Deck count changed to: ${totalDecks}`);

                 // If cards are already dealt, changing deck count mid-shoe requires a full reset
                 if (cardsSeen > 0 && oldDeckCount !== newDeckCount) {
                     alert(`Deck count changed from ${oldDeckCount} to ${totalDecks} mid-shoe. Resetting counts and hand for accuracy.`);
                     resetAll(); // Reset everything
                 } else if (cardsSeen === 0) {
                     // If changed before starting, just update counts/strategy display
                     updateCounts();
                     updateStrategyDisplay();
                 }
            } else {
                 alert("Please enter a valid number of decks (e.g., 1 to 10).");
                 deckCountInput.value = totalDecks; // Revert to previous valid value
            }
        });
    }

    // 6. Keyboard shortcuts (Example: 'N' for next split hand)
    document.addEventListener('keydown', (e) => {
         // Avoid triggering shortcuts if user is typing in an input field
         if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
             return;
         }

         // Check for 'N' key (case-insensitive) for next split hand
         if (e.key.toUpperCase() === 'N') {
             // Check if the "Next Hand" button is visible and enabled
             if (nextHandButton && !nextHandButton.classList.contains('hidden') && !nextHandButton.disabled) {
                 switchSplitHand();
             }
         }
         // Add more shortcuts here if needed (e.g., 'R' for reset hand, 'Shift+R' for reset all)
         // Example: Reset Hand with 'R'
         // if (e.key.toUpperCase() === 'R' && !e.shiftKey) {
         //     if (resetHandButton && !resetHandButton.disabled) resetHand();
         // }
         // Example: Reset All with 'Shift + R'
         // if (e.key.toUpperCase() === 'R' && e.shiftKey) {
         //      if (resetAllButton && !resetAllButton.disabled) resetAll();
         // }
    });

    // --- Initial Setup ---
    console.log("Initializing Blackjack Trainer...");
    setActiveSection('player'); // Start with player section active
    updateCounts(); // Calculate and display initial counts (all zero)
    updateStrategyDisplay(); // Display initial strategy messages (likely '-')
    console.log("Initialization complete.");

}); // End DOMContentLoaded