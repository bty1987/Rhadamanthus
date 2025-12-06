package com.fanglin.aliyun.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ossconfig", catalog = "data")
public class OssConfigPO implements Serializable {

	private static final long serialVersionUID = -377458132071370654L;

	private long ossId;

	private String accessKeyId;

	private String accessKeySecret;

	private String endpoint;

	private String bucket;

	private String dir;

	private int expireTime;

	private String policy;

	private String signature;

	private Timestamp deadline;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ossId")
	public long getOssId() {
		return ossId;
	}

	public void setOssId(long ossId) {
		this.ossId = ossId;
	}

	@Column(name = "accessKeyId")
	public String getAccessKeyId() {
		return accessKeyId;
	}

	public void setAccessKeyId(String accessKeyId) {
		this.accessKeyId = accessKeyId;
	}

	@Column(name = "accessKeySecret")
	public String getAccessKeySecret() {
		return accessKeySecret;
	}

	public void setAccessKeySecret(String accessKeySecret) {
		this.accessKeySecret = accessKeySecret;
	}

	@Column(name = "endpoint")
	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}

	@Column(name = "bucket")
	public String getBucket() {
		return bucket;
	}

	public void setBucket(String bucket) {
		this.bucket = bucket;
	}

	@Column(name = "dir")
	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}

	@Column(name = "expireTime")
	public int getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(int expireTime) {
		this.expireTime = expireTime;
	}

	@Column(name = "policy")
	public String getPolicy() {
		return policy;
	}

	public void setPolicy(String policy) {
		this.policy = policy;
	}

	@Column(name = "signature")
	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	@Column(name = "deadline")
	public Timestamp getDeadline() {
		return deadline;
	}

	public void setDeadline(Timestamp deadline) {
		this.deadline = deadline;
	}

}
