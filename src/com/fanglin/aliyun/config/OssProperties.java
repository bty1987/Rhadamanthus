package com.fanglin.aliyun.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 阿里云 OSS 配置 Bean
 *
 * 从 sysconfig.properties 注入主账号 AK/SK，全后端唯一持有明文密钥的入口。
 * AK/SK 仅用于后端签发 STS 临时凭证或服务端兜底上传，不直接下发前端。
 *
 * @see com.fanglin.core.security.EncryptPropertyPlaceholderConfigurer 自动解密 ENC(...) 包裹的 accessKeySecret
 */
@Component
public class OssProperties {

	@Value("${oss.enabled:false}")
	private boolean enabled;

	@Value("${oss.accessKeyId:}")
	private String accessKeyId;

	/** 已加密（ENC(...)），由 EncryptPropertyPlaceholderConfigurer 启动时解密为明文 */
	@Value("${oss.accessKeySecret:}")
	private String accessKeySecret;

	@Value("${oss.endpoint:}")
	private String endpoint;

	@Value("${oss.bucket:}")
	private String bucket;

	@Value("${oss.region:}")
	private String region;

	@Value("${oss.roleArn.upload:}")
	private String uploadRoleArn;

	@Value("${oss.roleArn.read:}")
	private String readRoleArn;

	/** STS 临时凭证有效期（秒），默认 900 */
	@Value("${oss.sts.expireSeconds:900}")
	private long stsExpireSeconds;

	/** 预签名 URL 有效期（秒），默认 1800 */
	@Value("${oss.presign.expireSeconds:1800}")
	private long presignExpireSeconds;

	/** 单文件大小上限（字节），默认 5MB */
	@Value("${oss.upload.maxFileSize:5242880}")
	private long maxFileSize;

	@Value("${oss.upload.allowedExts:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx}")
	private String allowedExts;

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getAccessKeyId() {
		return accessKeyId;
	}

	public void setAccessKeyId(String accessKeyId) {
		this.accessKeyId = accessKeyId;
	}

	public String getAccessKeySecret() {
		return accessKeySecret;
	}

	public void setAccessKeySecret(String accessKeySecret) {
		this.accessKeySecret = accessKeySecret;
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}

	public String getBucket() {
		return bucket;
	}

	public void setBucket(String bucket) {
		this.bucket = bucket;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getUploadRoleArn() {
		return uploadRoleArn;
	}

	public void setUploadRoleArn(String uploadRoleArn) {
		this.uploadRoleArn = uploadRoleArn;
	}

	public String getReadRoleArn() {
		return readRoleArn;
	}

	public void setReadRoleArn(String readRoleArn) {
		this.readRoleArn = readRoleArn;
	}

	public long getStsExpireSeconds() {
		return stsExpireSeconds;
	}

	public void setStsExpireSeconds(long stsExpireSeconds) {
		this.stsExpireSeconds = stsExpireSeconds;
	}

	public long getPresignExpireSeconds() {
		return presignExpireSeconds;
	}

	public void setPresignExpireSeconds(long presignExpireSeconds) {
		this.presignExpireSeconds = presignExpireSeconds;
	}

	public long getMaxFileSize() {
		return maxFileSize;
	}

	public void setMaxFileSize(long maxFileSize) {
		this.maxFileSize = maxFileSize;
	}

	public String getAllowedExts() {
		return allowedExts;
	}

	public void setAllowedExts(String allowedExts) {
		this.allowedExts = allowedExts;
	}

	/**
	 * 拼接 OSS 访问 Host：https://{bucket}.{endpoint}
	 */
	public String getHost() {
		return String.format("https://%s.%s", bucket, endpoint);
	}

}
