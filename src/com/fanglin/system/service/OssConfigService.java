package com.fanglin.system.service;

import com.fanglin.system.vo.OssConfigVO;

public interface OssConfigService {

	public OssConfigVO generatePostSignature();

	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig);

	public int deleteImageSample(OssConfigVO ossConfig);
}
