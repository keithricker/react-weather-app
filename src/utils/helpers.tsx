export default {
  capitalize: (word:string) => word.charAt(0).toUpperCase()+ word.slice(1),
  validateAddress(addressInput:string) {
    let splitAddress = addressInput.split(',').map(element => element.trim())
    if (splitAddress.length === 4) {
      splitAddress[2] = splitAddress[2].trim()+' '+splitAddress.pop()
    }
    if (splitAddress.length === 3
      && (!isNaN(+addressInput.charAt(0))
      && (isNaN(+splitAddress[1].charAt(0)))
      && (typeof +splitAddress[splitAddress.length-1].split(' ')[1] === 'number'))) {
        return true
    }
    return false
  }
}
