import styled from "styled-components"

const Loading = ({ opacity = 0.5, show = false }) => {
  return (
    <>
      {show && (
        <div style={{
          position: 'fixed',
          zIndex: 10001,
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: `rgba(21, 66, 105, ${opacity})`
        }}
        >
          <div className="h-full flex flex-col items-center justify-center">
            {/* @ts-ignore */}
            <StyledLoading>
              <div className="loading-container">
                <div className="📦"></div>
                <div className="📦"></div>
                <div className="📦"></div>
                <div className="📦"></div>
                <div className="📦"></div>
              </div>
            </StyledLoading>
          </div>
        </div>
      )}
    </>
  )
}

const StyledLoading = styled.div`
  .loading-container {
    width: var(--container-size);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    }
  .📦 {
    width: var(--box-size);
    height: var(--box-size);
    position: relative;
    display: block;
    transform-origin: -50% center;
    border-radius: var(--box-border-radius);
    }
    .📦:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background-color: lightblue;
    border-radius: var(--box-border-radius);
    box-shadow: 0px 0px 10px 0px rgba(28, 159, 255, 0.4);
    }
    .📦:nth-child(1) {
    animation: slide var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(1):after {
    animation: color-change var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(2) {
    animation: flip-1 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(2):after {
    animation: squidge-1 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(3) {
    animation: flip-2 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(3):after {
    animation: squidge-2 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(4) {
    animation: flip-3 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(4):after {
    animation: squidge-3 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(5) {
    animation: flip-4 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(5):after {
    animation: squidge-4 var(--duration) ease-in-out infinite alternate;
    }
    .📦:nth-child(2):after {
    background-color: #1c9fff;
    }
    .📦:nth-child(3):after {
    background-color: #1fb1fd;
    }
    .📦:nth-child(4):after {
    background-color: #22c7fb;
    }
    .📦:nth-child(5):after {
    background-color: #23d3fb;
    }
    
    @keyframes slide {
    0% {
      background-color: #1795ff;
      transform: translatex(0vw);
    }
    100% {
      background-color: #23d3fb;
      transform: translatex(
      calc(var(--container-size) - (var(--box-size) * 1.25))
      );
    }
    }
    
    @keyframes color-change {
    0% {
      background-color: #1795ff;
    }
    100% {
      background-color: #23d3fb;
    }
    }
    
    @keyframes flip-1 {
    0%,
    15% {
      transform: rotate(0);
    }
    35%,
    100% {
      transform: rotate(-180deg);
    }
    }
    
    @keyframes squidge-1 {
    5% {
      transform-origin: center bottom;
      transform: scalex(1) scaley(1);
    }
    15% {
      transform-origin: center bottom;
      transform: scalex(1.3) scaley(0.7);
    }
    25%,
    20% {
      transform-origin: center bottom;
      transform: scalex(0.8) scaley(1.4);
    }
    55%,
    100% {
      transform-origin: center top;
      transform: scalex(1) scaley(1);
    }
    40% {
      transform-origin: center top;
      transform: scalex(1.3) scaley(0.7);
    }
    }
    
    @keyframes flip-2 {
    0%,
    30% {
      transform: rotate(0);
    }
    50%,
    100% {
      transform: rotate(-180deg);
    }
    }
    
    @keyframes squidge-2 {
    20% {
      transform-origin: center bottom;
      transform: scalex(1) scaley(1);
    }
    30% {
      transform-origin: center bottom;
      transform: scalex(1.3) scaley(0.7);
    }
    40%,
    35% {
      transform-origin: center bottom;
      transform: scalex(0.8) scaley(1.4);
    }
    70%,
    100% {
      transform-origin: center top;
      transform: scalex(1) scaley(1);
    }
    55% {
      transform-origin: center top;
      transform: scalex(1.3) scaley(0.7);
    }
    }
    
    @keyframes flip-3 {
    0%,
    45% {
      transform: rotate(0);
    }
    65%,
    100% {
      transform: rotate(-180deg);
    }
    }
    
    @keyframes squidge-3 {
    35% {
      transform-origin: center bottom;
      transform: scalex(1) scaley(1);
    }
    45% {
      transform-origin: center bottom;
      transform: scalex(1.3) scaley(0.7);
    }
    55%,
    50% {
      transform-origin: center bottom;
      transform: scalex(0.8) scaley(1.4);
    }
    85%,
    100% {
      transform-origin: center top;
      transform: scalex(1) scaley(1);
    }
    70% {
      transform-origin: center top;
      transform: scalex(1.3) scaley(0.7);
    }
    }
    
    @keyframes flip-4 {
    0%,
    60% {
      transform: rotate(0);
    }
    80%,
    100% {
      transform: rotate(-180deg);
    }
    }
    
    @keyframes squidge-4 {
    50% {
      transform-origin: center bottom;
      transform: scalex(1) scaley(1);
    }
    60% {
      transform-origin: center bottom;
      transform: scalex(1.3) scaley(0.7);
    }
    70%,
    65% {
      transform-origin: center bottom;
      transform: scalex(0.8) scaley(1.4);
    }
    100%,
    100% {
      transform-origin: center top;
      transform: scalex(1) scaley(1);
    }
    85% {
      transform-origin: center top;
      transform: scalex(1.3) scaley(0.7);
    }
  }
`

export { Loading }