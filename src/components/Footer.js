import styled from 'styled-components'


export default function Footer() {
  return(
    <FooterWraper>
      <div className="row">
        <div className="col-sm">
          <h4>Контакти:</h4>
            <div className="text-start card">
              <h6>Телефон: <a href="tel:380670003347">+380670003347</a></h6>
              <h6>Пошта: <a href="mailto:buh@sklobudresurs.com">buh@sklobudresurs.com</a></h6>
              <h6>Адреса: 35609, Рівненська обл., Дубенський р-н, с. Рачин, вул. Б. Хмельницького, 2</h6>
            </div>
        </div>

        <div className="col-sm align-center text-logo">
          <img src="logo_blue.png" alt="Logo" />
          Sklobudresurs
        </div>
      </div>
    </FooterWraper>
  )
}

const FooterWraper = styled.div`
  flex: 0 0 auto;
  font-size: calc(20px + 1vw) !important;

  background-image: var(--footerBackground);
  background-repeat: repeat;
  color: var(--textWhite);
  padding: 20px;

  .card{
    background: rgba(20, 30, 50, 0.4);
    border-radius: 1rem;
    margin: 2vmin;
    padding: 2vmin;
  }

  a{
    color: var(--textWhite) !important;
    /* text-decoration: none; */
  }

  img{
    height: calc(40px + 2vw);
  }
  .text-logo{
    font-family: 'Rubik Mono One', sans-serif;
    text-shadow: 10px 10px 10px var(--darkGrey);
  }
`
