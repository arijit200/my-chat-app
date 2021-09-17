import React, {useState, useEffect} from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Infobar from '../Infobar/Infobar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
// import TextContainer from '../TextContainer/TextContainer';
import './Chat.css';

let socket; //stores the endpoint 

const Chat = ({location}) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    // const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'https://its-a-chat-app.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        //2nd argument given because of CORS restriction policy
        socket = io(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']});

        // console.log(location.search);
        // console.log(name, room);
        setName(name);
        setRoom(room);

        // console.log(socket); //displays a list of values
        socket.emit('join', {name, room}, () => {
            //will be used for error handling
        }); 
        //used to emit the values
        // the name => 'join' will be used in the server => index.js file for identification
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);
    
    //for messages
    useEffect(() => {
        socket.on('message',(message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    //function to send a message
    const sendMessage = (event) => {
        
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, () => setMessage('')); //setMessage('') and not sendMessage('')
        }
    }

    console.log(message, messages);


    return ( 
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            {/* <TextContainer users={users}/> */}
        </div>
     );
}
 
export default Chat;