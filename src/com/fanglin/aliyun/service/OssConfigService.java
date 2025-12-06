package com.fanglin.aliyun.service;

import com.fanglin.aliyun.vo.OssConfigVO;

public interface OssConfigService {

	public OssConfigVO generatePostSignature(OssConfigVO ossConfig);

	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig);
}
