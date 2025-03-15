// Array of image paths for the reels.
const symbols = Array.from({length: 5}, (_, i) => `images/${i + 1}.png`);

// Initialize audio
const fanfareSound = document.getElementById('fanfareSound');

/**
 * Populates a reel element with several random symbols followed by a final symbol.
 * If isRigged is true, the final symbol is always the first image (1.png).
 * Otherwise, the final symbol is chosen randomly.
 */
function populateReel(reelElement, isRigged) {
  let html = "";
  const numRandomSymbols = 30; // Number of symbols before the final outcome
  for (let i = 0; i < numRandomSymbols; i++) {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    html += `<div class="symbol"><img src="${randomSymbol}" alt="Slot symbol"></div>`;
  }
  // Append the final symbol: rigged outcome forces first image, random outcome gets a random image.
  if (isRigged) {
    html += `<div class="symbol"><img src="${symbols[0]}" alt="Slot symbol"></div>`;
  } else {
    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    html += `<div class="symbol"><img src="${finalSymbol}" alt="Slot symbol"></div>`;
  }
  reelElement.innerHTML = html;
}

// On page load, populate each reel with a default outcome.
function setupReels() {
  populateReel(document.getElementById("reel1"), true);
  populateReel(document.getElementById("reel2"), true);
  populateReel(document.getElementById("reel3"), true);
}

function spinReels() {
  const spinButton = document.getElementById("spinButton");
  spinButton.disabled = true;

  // Reset and stop any playing sound
  fanfareSound.pause();
  fanfareSound.currentTime = 0;

  // Determine the outcome mode: 50% chance for rigged outcome, 50% for random.
  const isRigged = Math.random() < 0.5;
  console.log(isRigged ? "Rigged outcome" : "Random outcome");

  // Animate the lever to simulate pulling the slot machine lever downward
  gsap.to("#lever", {
    duration: 0.4,
    rotation: 30,
    ease: "power2.in",
    onComplete: () => {
      // After pulling down, animate it springing back up
      gsap.to("#lever", { 
        duration: 0.6, 
        rotation: 0, 
        ease: "elastic.out(1, 0.3)" 
      });
    }
  });

  // Get reel elements.
  const reel1 = document.getElementById("reel1");
  const reel2 = document.getElementById("reel2");
  const reel3 = document.getElementById("reel3");
  const reels = [reel1, reel2, reel3];

  // Repopulate each reel based on the chosen outcome and reset its position.
  reels.forEach(reel => {
    populateReel(reel, isRigged);
    gsap.set(reel, { y: 0 });
  });

  // Each reel container shows one symbol (80px tall).
  const symbolHeight = 80;
  // Total number of symbols in a reel (should be 31: 30 random + 1 final).
  const totalSymbols = reel1.children.length;
  // Calculate final translateY value so that the final symbol is visible.
  const finalPosition = (totalSymbols - 1) * symbolHeight;

  // Animate each reel with slightly different durations and delays.
  gsap.to(reel1, { duration: 2, ease: "power2.out", y: -finalPosition });
  gsap.to(reel2, { duration: 2.5, ease: "power2.out", y: -finalPosition, delay: 0.2 });
  gsap.to(reel3, { duration: 3, ease: "power2.out", y: -finalPosition, delay: 0.4, onComplete: () => {
      spinButton.disabled = false;
      // If outcome is rigged, trigger confetti celebration and play sound.
      if (isRigged) {
        // Play fanfare sound
        fanfareSound.play().catch(error => console.log('Error playing sound:', error));
        
        // Run confetti for 2 seconds.
        const duration = 2 * 1000;
        const end = Date.now() + duration;
        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
  }});
}

// Initialize the reels when the page loads
document.addEventListener('DOMContentLoaded', setupReels); 