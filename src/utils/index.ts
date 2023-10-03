export const getFlagByISOCode = (isoCode: string) => {
  return `https://www.worldometers.info//img/flags/small/${isoCode}-flag.gif`
}

export const doCORSRequest = (options: any, printResult: any) => {
  const cors_api_url = 'https://cors-anywhere.herokuapp.com/'
  const x = new XMLHttpRequest()
  x.open(options.method, cors_api_url + options.url)
  x.onload = x.onerror = function () {
    printResult(x.responseText || '')
  }
  x.send(options.data)
}

export const convertName = (name: string) => {
  return name.substring(0, name.length - 3).concat('***')
}
