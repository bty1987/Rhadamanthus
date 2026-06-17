package com.fanglin.aliyun.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.http.ProtocolType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.sts.model.v20150401.AssumeRoleRequest;
import com.aliyuncs.sts.model.v20150401.AssumeRoleResponse;
import com.fanglin.aliyun.config.OssProperties;
import com.fanglin.aliyun.service.StsTokenService;
import com.fanglin.aliyun.vo.StsTokenVO;

/**
 * STS 临时凭证服务实现
 *
 * 用主账号 AK/SK 调用阿里云 STS 的 AssumeRole，签发短期临时凭证。
 * 主账号密钥仅由 {@link OssProperties} 持有（来自加密配置文件），此处不落库。
 *
 * sessionName 同时充当 OSS 路径变量 ${oss:assumedRoleName}，配合 RAM 策略
 * 实现"每个会话只能写自己目录"，杜绝跨用户文件覆盖。
 */
@Service("stsTokenService")
public class StsTokenServiceImpl implements StsTokenService {

	public static final Logger logger = LoggerFactory.getLogger(StsTokenServiceImpl.class);

	@Autowired
	private OssProperties ossProperties;

	@Override
	public StsTokenVO assumeUploadToken(String sessionName) throws Exception {
		return doAssumeRole(ossProperties.getUploadRoleArn(), sessionName);
	}

	@Override
	public StsTokenVO assumeReadToken(String sessionName) throws Exception {
		return doAssumeRole(ossProperties.getReadRoleArn(), sessionName);
	}

	/**
	 * 执行 AssumeRole
	 *
	 * @param roleArn RAM 角色 ARN
	 * @param sessionName 会话标识（=userId），用于路径隔离与审计
	 */
	private StsTokenVO doAssumeRole(String roleArn, String sessionName) throws Exception {

		if (!ossProperties.isEnabled()) {
			throw new IllegalStateException("OSS 未启用，请检查 oss.enabled 配置");
		}

		if (roleArn == null || roleArn.isEmpty()) {
			throw new IllegalStateException("STS roleArn 未配置");
		}

		// sessionName 仅允许字母数字与下划线，避免非法字符污染 OSS 路径
		String safeSessionName = sanitizeSessionName(sessionName);

		DefaultProfile profile = DefaultProfile.getProfile(
			ossProperties.getRegion(),
			ossProperties.getAccessKeyId(),
			ossProperties.getAccessKeySecret());
		IAcsClient client = new DefaultAcsClient(profile);

		try {

			AssumeRoleRequest request = new AssumeRoleRequest();
			request.setSysEndpoint("sts." + ossProperties.getRegion() + ".aliyuncs.com");
			request.setRoleArn(roleArn);
			request.setRoleSessionName(safeSessionName);
			request.setDurationSeconds(ossProperties.getStsExpireSeconds());
			request.setSysProtocol(ProtocolType.HTTPS);

			AssumeRoleResponse response = client.getAcsResponse(request);
			AssumeRoleResponse.Credentials c = response.getCredentials();

			StsTokenVO vo = new StsTokenVO();
			vo.setAccessKeyId(c.getAccessKeyId());
			vo.setAccessKeySecret(c.getAccessKeySecret());
			vo.setSecurityToken(c.getSecurityToken());
			vo.setExpiration(c.getExpiration());
			vo.setBucket(ossProperties.getBucket());
			vo.setEndpoint(ossProperties.getEndpoint());
			vo.setRegion(ossProperties.getRegion());
			vo.setHost(ossProperties.getHost());
			// 会话级隔离目录：与 RAM 策略 ${oss:assumedRoleName} 变量对应
			vo.setDir(safeSessionName + "/");

			return vo;

		} catch (Exception e) {
			logger.error("签发 STS 临时凭证失败 [roleArn={}, sessionName={}]", roleArn, safeSessionName, e);
			throw e;
		} finally {
			try {
				client.shutdown(); // SDK 4.x 提供，释放内部线程池
			} catch (Throwable t) {
				logger.warn("IAcsClient 关闭异常", t);
			}
		}
	}

	/**
	 * 规整会话名：仅保留字母数字下划线，其余替换为下划线，控制长度
	 */
	private String sanitizeSessionName(String sessionName) {
		if (sessionName == null || sessionName.isEmpty()) {
			return "anonymous";
		}
		String safe = sessionName.replaceAll("[^a-zA-Z0-9_]", "_");
		if (safe.length() > 32) {
			safe = safe.substring(0, 32);
		}
		return safe;
	}

}
