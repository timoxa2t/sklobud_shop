
import styled from 'styled-components'

export const UserField = (props) => {

  return (
    <Container>
      <div className="column justify-content-center infoComponent">
        <div className="inline-block">
          <div className="propName ">
            {props.name}
          </div>
          <input
            id={props.id}
            value={props.value}
            placeholder={props.name}
            type={props.type}
            onChange={(event) => props.onChange(event.target.value)}
            onKeyPress={(event) => props.onKeyPress(event)}/>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  .propName{
    width: 30vmin;
    display: inline-block;
  }

  .infoComponent{
    margin: 2vmin;
  }
  .inline-block{
    display: inline-block;
    background: rgb(150,200,200);
    border-radius: 1rem;
  }
`
