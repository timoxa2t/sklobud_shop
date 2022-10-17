import {useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import styled from 'styled-components'
import {updateUserData} from "../store/actions/user"
import {UserField} from './User'

export default function Profile() {
  const currentUser = useSelector(state => state.user)

  const [firstName, mSetFirstName] = useState(currentUser.firstName)
  const [lastName, mSetLastName] = useState(currentUser.lastName)
  const [email, mSetEmail] = useState(currentUser.email)
  const [phone, mSetPhone] = useState(currentUser.phone)
  const [address, mSetAddress] = useState(currentUser.address)

  const [updateStatus, setUpdateStatus] = useState({status: "", message: ""})

  const handleUserDataKeyPress = (event) => {
    const {id, value} = event.target
    if(event.key === "Enter" && currentUser[id] !== value){
      dispatch(updateUserData(currentUser.userId, value, id, setUpdateStatus))
    }
  }

  // const handleContactInfoKeyPress = (event) => {
  //   const {id, value} = event.target
  //   if(event.key === "Enter" && currentUser[id] !== value){
  //     dispatch(updateUserContactInfo(currentUser.id, value, id, setUpdateStatus))
  //   }
  // }

  const dispatch = useDispatch()
  return (
    <ProfileContainer>
      {currentUser.id !== 0 ?(
      <div className="container">
        <div className="row">
          <div className="col-12 justify-content-center">
            Особистий кабінет
          </div>
        </div>
        {updateStatus.status === "" ? null:
          <div className={"status-bar " + ((status) => {
            switch (status) {
              case "loading":
                return "status-loading"
              case "succsess":
                return "status-succsess"
              case "error":
                return "status-error"
              default: return ""
            }
          })(updateStatus.status)}>
            {updateStatus.message}
          </div>
        }
        <UserField name="Ім'я" value={firstName} id="firstName" type="text" onChange={(newFirstName) => {mSetFirstName(newFirstName)}} onKeyPress={handleUserDataKeyPress} />
        <UserField name="Прізвище" value={lastName} id="lastName" type="text" onChange={(newLastName) => {mSetLastName(newLastName)}} onKeyPress={handleUserDataKeyPress} />
        <UserField name="Пошта" value={email} id="email" type="email" onChange={(newEmail) => {mSetEmail(newEmail)}} onKeyPress={handleUserDataKeyPress} />
        <UserField name="Телефон" value={phone} id="phone"  type="number" onChange={(newPhone) => {mSetPhone(newPhone)}} onKeyPress={handleUserDataKeyPress} />
        <UserField name="Адреса" value={address} id="address"  type="text" onChange={(newAddress) => {mSetAddress(newAddress)}} onKeyPress={handleUserDataKeyPress} />
      </div>
      ): <div>Увійдіть в особистий кабінет</div>}
    </ProfileContainer>
  )
}

// const InfoComponent = (props) => {
//
//   return (
//     <div className="column justify-content-center infoComponent">
//       <div className="inline-block">
//         <div className="propName ">
//           {props.name}
//         </div>
//         <input
//           id={props.id}
//           value={props.value}
//           placeholder={props.name}
//           type={props.type}
//           onChange={(event) => props.onChange(event.target.value)}
//           onKeyPress={(event) => props.onKeyPress(event)}/>
//       </div>
//     </div>
//   )
// }

const ProfileContainer = styled.div`

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
  }

  .status-bar{
    border-radius: 0.5vw;
  }

  .status-loading{
    background: rgba(0,100,200,0.3);
  }
  .status-succsess{
    background: rgba(0,200,0,0.3);
  }
  .status-error{
    background: rgba(200,0,0,0.3);
  }
`
