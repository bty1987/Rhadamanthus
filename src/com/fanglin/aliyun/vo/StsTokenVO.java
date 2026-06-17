package com.fanglin.aliyun.vo;

/**
 * STS 临时凭证传输对象
 *
 * 携带短期有效的 AK/SK/SecurityToken，前端用此三元组直传 OSS。
 * 凭证默认 15 分钟失效，过期后重新申请，不可持久化存储。
 */
public class StsTokenVO {

	/** 临时 AccessKey ID */
	private String accessKeyId;

	/** 临时 AccessKey Secret */
	private String accessKeySecret;

	/** 临时 SecurityToken（直传时必带） */
	private String securityToken;

	/** 凭证过期时间（GMT 字符串，如 2024-12-06T08:00:00Z） */
	private String expiration;

	/** Bucket 名称 */
	private String bucket;

	/** OSS 端点 */
	private String endpoint;

	/** 地域（如 cn-hangzhou） */
	private String region;

	/** 完整 Host：https://{bucket}.{endpoint} */
	private String host;

	/** 会话级上传目录前缀（含 sessionName 做路径隔离） */
	private String dir;

	public StsTokenVO() {
		super();
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

	public String getSecurityToken() {
		return securityToken;
	}

	public void setSecurityToken(String securityToken) {
		this.securityToken = securityToken;
	}

	public String getExpiration() {
		return expiration;
	}

	public void setExpiration(String expiration) {
		this.expiration = expiration;
	}

	public String getBucket() {
		return bucket;
	}

	public void setBucket(String bucket) {
		this.bucket = bucket;
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

}
