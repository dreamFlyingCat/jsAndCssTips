
function getThumbnail(src, cb) {
    const path = dealPath(src)

    API.stat(src.replace('file:///', ''), (options) => {

      let width = 200, height = 200

      let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image()
      img.onload = function(){
       if(img.height > img.width){
           height = Math.min(img.height, height)
           width = height / img.height * img.width

       }else {
          width = Math.min(img.width, width)
          height = width / img.width * img.height
       }
        canvas.height = height
        canvas.width = width
        ctx.drawImage(img,0,0,img.width,img.height,0,0, width, height)

        const dataURL = canvas.toDataURL('image/png')
        if(!API.exists(path))
          dataURLtoFile(dataURL,path)
        cb(path)
        canvas = null

      }
      img.src = src

    })
  }
function dealPath(src){
  const index = src.lastIndexOf('.')
  const mime = src.slice(index, src.length)
  return src.slice(0, index) + '_s' + mime
}
//将base64转换为文件对象
function dataURLtoFile(dataurl, path) {
    var arr = dataurl.split(',');
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    API.writeFile(path.replace('file:///', ''), u8arr)
}
