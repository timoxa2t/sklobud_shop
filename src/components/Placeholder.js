
import React from 'react'
import styled from 'styled-components'


export default function Placeholder(props) {

  return (
    <React.Fragment>

            <ImageWrapper>
              <img  src="/main_pic1.jpg" className="main-image" alt="homepage" />
              <div className="centered">
                Приймаєм замовлення  по телефону: (067)000-33-47
              </div>
            </ImageWrapper>

    </React.Fragment>
  )
}


const ImageWrapper = styled.div`

    color: white;
    position: relative;
    overflow: hidden;

  .main-image {
    min-width: 100%;
    max-width: 100%;
    background-color: #999999;
  }

  .centered {
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-10%, -50%);
    font-size: calc(10px + 3vw);
    text-align: center;
    background: rgba(50, 50, 70, 0.5);
    border-radius: 1rem;
    padding: 2vmin;
}
`
