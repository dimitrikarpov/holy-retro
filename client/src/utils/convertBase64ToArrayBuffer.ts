// let str = 'data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=';

// fetch(str)
//   .then(b => b.arrayBuffer())
//   .then(buff => console.log( new Int8Array(buff) /* just for a view purpose */ ))
//   .catch(e => console.log(e))

/*
await (await fetch("data:application/octet;base64," + base64data)).arrayBuffer()
 */

export const convertBase64ToArrayBuffer = async (base64: string) => {
  const buffer = await (await fetch(base64)).arrayBuffer()

  // return buffer

  return new Uint8Array(buffer)
}
