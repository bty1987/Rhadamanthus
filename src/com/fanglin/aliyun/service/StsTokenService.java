package com.fanglin.aliyun.service;

import com.fanglin.aliyun.vo.StsTokenVO;

/**
 * 阿里云 STS 临时凭证服务
 *
 * 用主账号 AK/SK 调用 AssumeRole，签发短期凭证供前端直传 OSS。
 * sessionName 同时作为 OSS 路径变量 ${oss:assumedRoleName}，实现按用户/业务做目录隔离。
 */
public interface StsTokenService {

	/**
	 * 签发上传临时凭证（仅 oss:PutObject 权限，限定到 sessionName 目录）
	 *
	 * @param sessionName 会话标识，建议传 userId，用于路径隔离与审计
	 */
	StsTokenVO assumeUploadToken(String sessionName) throws Exception;

	/**
	 * 签发读取临时凭证（oss:GetObject 权限），用于私有 bucket 预签名场景
	 *
	 * @param sessionName 会话标识
	 */
	StsTokenVO assumeReadToken(String sessionName) throws Exception;

}
