// Find this CSS in your App.jsx file and update the PenguinContainer styled component:

const PenguinContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 200px;
  height: 300px;  /* Increased from 200px to 300px for greater height */
  animation: waddle 2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
  @keyframes waddle {
    from { left: -220px; }
    to { left: 50vw; }
  }
`;

// And if you're using an actual image tag, you might want to adjust it as well:
// Find this part in your render function and update:

{showPenguin && (
  <PenguinContainer>
    {/* <Lottie animationData={penguinData} loop={false} /> */}
    <img 
      src="/penguin.png" 
      alt="Penguin" 
      style={{ 
        width: '100%', 
        height: '100%',
        objectFit: 'contain',  /* This ensures the image maintains its aspect ratio */
        objectPosition: 'bottom'  /* This anchors the image to the bottom of the container */
      }} 
    />
  </PenguinContainer>
)}
