export default function getAudioDataFromMessageBody(dataURI: string): string {
  const BASE64_MARKER = ';base64,'
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
  const base64 = dataURI.substring(base64Index)
  const raw = window.atob(base64)
  const rawLength = raw.length
  const arr = new Uint8Array(new ArrayBuffer(rawLength))

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i)
  }
  const blob = new Blob([arr], {
    type: 'audio/ogg'
  })

  const blobURL = URL.createObjectURL(blob)

  return blobURL
}
