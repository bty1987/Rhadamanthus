package com.fanglin.system.service;

import com.fanglin.system.vo.OssConfigVO;

public interface OssConfigService {

	public OssConfigVO generatePostSignature(OssConfigVO ossConfig);

	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig);
}
