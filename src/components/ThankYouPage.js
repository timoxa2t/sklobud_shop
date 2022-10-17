
import React from 'react'
import styled from 'styled-components'

export default function ThankYouPage(props) {

  return (
    <React.Fragment>
      <Wrapper>
        <ImageWrapper >
          <div className="centered">
            Дякуємо за замовлення
          </div>
        </ImageWrapper>
      </Wrapper>
    </React.Fragment>
  )
}



const Wrapper = styled.div`
  flex: 1 0 auto;
  width: 100%;
  height: 100%;
  background: url("concrete_background.png") no-repeat;
  background-size: cover;
  background-position: center;
`

const ImageWrapper = styled.div`

    color: white;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;


  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: calc(10px + 3vw);
    background: rgba(50, 50, 70, 0.5);
    border-radius: 1rem;
    padding: 2vmin;
}
`
