// import {useState, useEffect} from 'react'
// import {useDispatch} from 'react-redux'
import styled from 'styled-components'
// import {Link, useLocation} from 'react-router-dom'
// import {Button, InputGroup, FormControl} from 'react-bootstrap';


// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// function useWindowSize() {
//
//   const [windowSize, setWindowSize] = useState({
//     width: undefined,
//     height: undefined,
//   });
//   useEffect(() => {
//     function handleResize() {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return windowSize;
// }


export default function ServiceItem(props){
  // const [count, setCount] = useState()
  // const dispatch = useDispatch()
  const {name, price, description} = props.details
  // const size = useWindowSize()


  return(
    <ServiceWrapper>
      <div className="card mt-3 mb-2">
      <div className="card-header d-flex justify-content-around text-center">
        <p className="align-self-center mb-0">{name}</p>
      </div>
        <div className="img-container p-1 text-center" >
          <div className="row">
            <div className="col-12">
              {props.details.hasOwnProperty("img") && <div className="p-3">
                <img src={props.details.img} alt="product" className="card-img-top"/>
              </div>}
              {price &&
                <>
                <div className="text-blue font-italic mb-0 p-1">
                  Ціна:
                  <span className="mr-1"> ₴</span>
                  {price} за куб
                </div>
                </>
              }


            </div>
            <div className="col-11 ps-4">
              <p className="description_container text-start">{description.length > 1000 ? description.substring(0,1000) + "...": description}</p>
            </div>
          </div>
        </div>
      </div>
    </ServiceWrapper>
  )
}

const ServiceWrapper = styled.div`

  .card{
    transition: all 0.2s linear;
    background: var(--cardBackground);
    border-radius: 1rem;
  }

  .card-footer{
    transition: all 0.2s linear;
    border-radius: 0 0 1rem 1rem;
    font-size: var(--standartFontSize);
  }

  .description_container{
    font-size: var(--smallFontSize);
  }

  .nav-link{
    color: var(--mainWhite) !important;
    font-size: var(--smallFontSize);
  }

  &:hover{
    .card{
      border: 0.04srem solid rgba(0,0,35,0.3);
      box-shadow: 6px 6px 15px 0px rgba(0,0,35,0.2);
    }
    .card-footer{
      background-image: url("cementl-texture-small.jpg");
      color: var(--textWhite) ;
    }
  }

  .img-container{
    position: relative;
    overflow: hidden;
    text-align: left;
  }

  .card-img-top {
    max-height: 30vmin;
    max-width: 50vmin;
    width: auto;
    margin: auto;
    transition: all 0.3s linear;
    border-radius: 1rem;
  }

  .img-container: hover .card-img-top{
    transform: scale(1.1);
  }

  .cart-btn {
    padding: 0.2rem;
    background-image: url("cementl-texture-small.jpg");
    border: none;
    color: var(--textWhite);
    border-radius: 0.5rem 0 0 0;
    transition: all 0.3s linear;
  }

  .img-container:hover .description_container{
    transform: translate(0,0);
  }

  .cart-btn:hover{
    color: var(--textBlack)
  }
`
