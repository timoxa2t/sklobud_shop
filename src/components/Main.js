


import { Slide } from 'react-slideshow-image';
import React from 'react'
import styled from 'styled-components'
import 'react-slideshow-image/dist/styles.css'


export default function Main(props) {


  return (
    <React.Fragment>
      <Wrapper>
        <div className="description-container">
          {props.description}
        </div>
        <Slide>
          <div className="each-slide" >
            <ImageWrapper>
              <img  src="/main_pic1_small.jpg" srcSet="main_pic1_small.jpg 500w, main_pic1_medium.jpg 1900w, main_pic1.jpg 3000w" className="main-image" alt="homepage" />
              <div className="centered">
                {props.imageTitle}
              </div>
            </ImageWrapper>
          </div>
          <div className="each-slide" >
            <ImageWrapper>
              <img  src="/main_pic3_small.jpg" srcSet="main_pic3_small.jpg 500w, main_pic3_medium.jpg 1900w, main_pic3.jpg 3000w" className="main-image" alt="homepage" />
              <div className="centered">
                {props.imageTitle}
              </div>
            </ImageWrapper>
          </div>
        </Slide>
        <div className="p-lg-5 p-2">
          <div className="card">
            <div className="description-container">
              НАШІ СЕРТИФІКАТИ
            </div>
            <ImageWrapper className="row image-spacing">
              <div className="col-lg-6 col-12 pt-2">
                <img src="/sertificate1.jpg" className="cert-image" alt="sertificate1"/>
              </div>
              <div className="col-lg-6 col-12 pt-2">
                <img src="/sertificate2.jpg" className="cert-image" alt="sertificate2"/>
              </div>
            </ImageWrapper>
          </div>
        </div>
      </Wrapper>
    </React.Fragment>
  )
}


Main.defaultProps = {
  imageTitle: "SKLOBUDRESURS",
  description : "Ми займаємося виготовленням і доставкою різноманітних сумішей бетону для усіх ваших потреб.",
}

const Wrapper = styled.div`
  flex: 1 0 auto;

  .description-container{
    margin: 2vmin;
  }

  .image-spacing{
    padding: 2vw 10vw 2vw 10vw;
  }

  .card{
    transition: all 0.2s linear;
    background: var(--cardBackground);
    border-radius: 1rem;
  }
`

const ImageWrapper = styled.div`

    color: white;
    position: relative;
    overflow: hidden;

  .main-image {
    min-width: 100%;
    max-width: 100%;

  }

  .cert-image{
    max-width: 100%;
  }

  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: calc(10px + 3vw);
    font-family: 'Rubik Mono One', sans-serif;
    background: rgba(50, 50, 70, 0.5);
    border-radius: 1rem;
    padding: 2vmin;
}
`
