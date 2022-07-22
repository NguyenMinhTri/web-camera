var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/video', function(req, res, next) {
  var tagId = req.query.tagid;
  const child_process = require('child_process');
  res.header('Connection', 'close');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache');
  res.header('content-type', 'video/mp4');
  console.log(req.query);
  console.log(req.query.tagid);
  let rtspUrl = tagId.replaceAll("question","?").replaceAll("equal","=").replaceAll("ampersand","&");
  const cmd = `ffmpeg -rtsp_transport tcp -i ${rtspUrl} -c:v copy -bsf:v h264_mp4toannexb -c:a copy -maxrate 7000k -bufsize 7000k -c:v libx264 -pix_fmt yuv420p -s 640x360 -r 30 -f matroska -`.split(' ');
	
  var child = child_process.spawn(cmd[0], cmd.splice(1), {
      stdio: ['ignore', 'pipe', process.stderr]
  });

  child.stdio[1].pipe(res);

  res.on('close', () => {
      // Kill ffmpeg if the flow is stopped by the browser
      child.kill();
  });
});

module.exports = router;
