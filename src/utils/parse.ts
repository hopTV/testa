export const parseJSON = <T>(jsonString: string | null): T | undefined => {
  try {
    return JSON.parse(jsonString ?? '')
  } catch (e) {
    return undefined
  }
}
