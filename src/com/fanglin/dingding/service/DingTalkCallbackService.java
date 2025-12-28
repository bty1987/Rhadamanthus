/**
 * @File Name		: DingTalkCallbackService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2018-12-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

/**
 * 钉钉回调服务接口
 */
public interface DingTalkCallbackService {

	/**
	 * 处理钉钉回调
	 * @param signature 签名
	 * @param nonce 随机数
	 * @param timestamp 时间戳
	 * @param encrypt 加密内容
	 * @return 响应Map
	 * @throws FLException 异常
	 */
	public Map<String, String> callback(String signature, String nonce, String timestamp, String encrypt) throws FLException;

}
