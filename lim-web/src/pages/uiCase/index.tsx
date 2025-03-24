import React from 'react';
import { Card } from 'antd';

const VideoPlayer = () => {
  const videoUrl = "//player.bilibili.com/player.html?isOutside=true&aid=112489770191616&bvid=BV1raukeyEpo&cid=500001556010360&p=1";

  return (
    <Card title={<h3 style={{ fontWeight: 'bold' }}>UI 测试平台功能介绍（支持录制、图像识别的自动化）：</h3>} style={{ width: '100%' }}>
      <div style={{ width: '90%', height: 'calc(100vh - 210px)' }}>
        <iframe
          src={videoUrl}
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </Card>
  );
};

export default VideoPlayer;