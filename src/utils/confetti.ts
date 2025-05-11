// Simple confetti effect
const confetti = () => {
  // Create confetti elements
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 150;
  
  // Container for confetti
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  // Create and animate confetti pieces
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confettiPiece = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random confetti style (square or rectangle)
      const isRect = Math.random() > 0.5;
      const width = isRect ? Math.random() * 10 + 5 : Math.random() * 15 + 5;
      const height = isRect ? Math.random() * 20 + 5 : width;
      
      // Position and style
      confettiPiece.style.position = 'absolute';
      confettiPiece.style.width = `${width}px`;
      confettiPiece.style.height = `${height}px`;
      confettiPiece.style.backgroundColor = color;
      confettiPiece.style.left = `${Math.random() * 100}%`;
      confettiPiece.style.top = '-20px';
      confettiPiece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiPiece.style.opacity = '1';
      confettiPiece.style.transition = 'all linear';
      
      container.appendChild(confettiPiece);
      
      // Random animation duration (2-6 seconds)
      const duration = Math.random() * 4000 + 2000;
      
      // Animate falling
      setTimeout(() => {
        confettiPiece.style.top = `${100 + Math.random() * 20}%`;
        confettiPiece.style.left = `${parseFloat(confettiPiece.style.left) + (Math.random() * 40 - 20)}%`;
        confettiPiece.style.transform = `rotate(${Math.random() * 360 + 360}deg)`;
        confettiPiece.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          confettiPiece.remove();
          
          // Remove container when all confetti are gone
          if (container.childElementCount === 0) {
            container.remove();
          }
        }, duration);
      }, 10);
    }, Math.random() * 500); // Stagger the start times
  }
};

export default confetti;