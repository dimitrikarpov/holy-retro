export const Player: React.FunctionComponent = () => {
  return (
    <>
      <h1>Player page</h1>
    </>
  )
}

/*
  player states:
  isRomRecieved,
  isSaveStateRecieved,

  --------------------

  messages to recieve:

  {type: rom, payload: binary data}
  {type: save: paylaod: binary data}
  {type: game:run}
  {type: game:reset}


  messages to send:

  {type: rom:recieved}
  {type: save:recieved}

*/
