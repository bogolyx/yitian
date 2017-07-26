
function getById(id){
	return document.getElementById(id);
}

//warpid : 容器id，存放附件或图片的 dom 元素的id
//fieldid  : 存放服务器返回的附件id
//uploadSuccess : 上传成功后的回调事件
function fileUpload(warpid,fieldid,uploadSuccess){
	var warp = getById(warpid);
	warp.addEventListener('tap',function(){
		if (mui.os.plus) { 
            var a = [{ 
                title: "拍照" 
            }, { 
                title: "从手机相册选择" 
            }]; 
            plus.nativeUI.actionSheet({ 
                title: "上传隐患图片", 
                cancel: "取消", 
                buttons: a 
            }, function(b) { /*actionSheet 按钮点击事件*/ 
                switch (b.index) { 
                    case 0: 
                        break; 
                    case 1: 
                        getImage(warpid,fieldid,uploadSuccess); /*拍照*/ 
                        break; 
                    case 2: 
                        galleryImg(warpid,fieldid,uploadSuccess);/*打开相册*/ 
                        break; 
                    default: 
                        break; 
                } 
            }) 
        } 
	}, false)
}

//拍照 
function getImage(warpid,fieldid,uploadSuccess) { 
    var c = plus.camera.getCamera(); 
    c.captureImage(function(e) { 
        plus.io.resolveLocalFileSystemURL(e, function(entry) { 
            var s = entry.toLocalURL() + "?version=" + new Date().getTime(); 
            uploadHead(s,warpid,fieldid,uploadSuccess); /*上传图片*/ 
        }, function(e) { 
            console.log("读取拍照文件错误：" + e.message); 
        }); 
    }, function(s) { 
        console.log("error" + s); 
    }, { 
        filename: "_doc/head.png" 
    }) 
} 
//本地相册选择 
function galleryImg(warpid,fieldid,uploadSuccess) { 
    plus.gallery.pick(function(a) { 
        plus.io.resolveLocalFileSystemURL(a, function(entry) { 
            plus.io.resolveLocalFileSystemURL("_doc/", function(root) { 
                root.getFile("head.png", {}, function(file) { 
                    //文件已存在 
                    file.remove(function() { 
                        console.log("file remove success"); 
                        entry.copyTo(root, 'head.png', function(e) { 
                                var e = e.fullPath + "?version=" + new Date().getTime(); 
                                uploadHead(e,warpid,fieldid,uploadSuccess); /*上传图片*/ 
                                //变更大图预览的src 
                                //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现 
                            }, 
                            function(e) { 
                                console.log('copy image fail:' + e.message); 
                            }); 
                    }, function() { 
                        console.log("delete image fail:" + e.message); 
                    }); 
                }, function() { 
                    //文件不存在 
                    entry.copyTo(root, 'head.png', function(e) { 
                            var path = e.fullPath + "?version=" + new Date().getTime(); 
                            uploadHead(path,warpid,fieldid,uploadSuccess); /*上传图片*/ 
                        }, 
                        function(e) { 
                            console.log('copy image fail:' + e.message); 
                        }); 
                }); 
            }, function(e) { 
                console.log("get _www folder fail"); 
            }) 
        }, function(e) { 
            console.log("读取拍照文件错误：" + e.message); 
        }); 
    }, function(a) {}, { 
        filter: "image" 
    }) 
}; 

//上传头像图片 
function uploadHead(imgPath,warpid,fieldid,uploadSuccess) { 
    console.log("imgPath = " + imgPath); 
	getById(warpid).src = imgPath; 
	//mainImage.src = imgPath; 
	//mainImage.style.width = "60px"; 
	//mainImage.style.height = "60px"; 
	
	var options = {
		method: "POST"
	} 
	var upload = plus.uploader.createUpload(domain + "/document/upload", options, function(rs, state) {
		if(state == 200) {  
			console.log(rs.responseText);
			if(rs.responseText){
				var response=JSON.parse(rs.responseText); 
				getById(fieldid).value = response.id;
				if(uploadSuccess){
					return uploadSuccess(rs.responseText);
				}
			}
		} else {
			console.log("上传错误：" + state);
		}
	}); 
	var defaultoptions = {
		key: "Filedata"
	}
	upload.addFile(imgPath, defaultoptions); 
	upload.start();
} 
//将图片压缩转成base64 
function getBase64Image(img) { 
	var canvas = document.createElement("canvas"); 
	var width = img.width; 
	var height = img.height; 
	// calculate the width and height, constraining the proportions 
	if (width > height) { 
	    if (width > 100) { 
	        height = Math.round(height *= 100 / width); 
	        width = 100; 
	    } 
	} else { 
	    if (height > 100) { 
	        width = Math.round(width *= 100 / height); 
	        height = 100; 
	    } 
	} 
	canvas.width = width;   /*设置新的图片的宽度*/ 
	canvas.height = height; /*设置新的图片的长度*/ 
	var ctx = canvas.getContext("2d"); 
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/ 
	var dataURL = canvas.toDataURL("image/png", 0.8); 
	return dataURL.replace("data:image/png;base64,", ""); 
}    
