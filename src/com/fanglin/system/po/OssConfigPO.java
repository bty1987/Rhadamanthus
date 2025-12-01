package com.fanglin.system.po;

import javax.annotation.PreDestroy;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;

@Configuration
public class OssConfigPO {

	private String endpoint = "oss-cn-beijing.aliyuncs.com";

	private String bucket = "edu-njc";

	private String dir = "user-dir-image/";

	private long expireTime = 3600;

	private String host = "https://" + bucket + "." + endpoint;

	private String accessKeyId = "LTAI5tDTAusqeVtWmeZDwcLb";

	private String accessKeySecret = "VB3SqbKFvKnI07T4yLRHXZx6Nck0hT";

	private OSS ossClient;

	@Bean
	public OSS getOssClient() {

		if (ossClient == null) {
			ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
		}
		return ossClient;
	}

	@Bean
	public String getEndpoint() {
		return endpoint;
	}

	@Bean
	public String getBucket() {
		return bucket;
	}

	@Bean
	public String getDir() {
		return dir;
	}

	@Bean
	public long getExpireTime() {
		return expireTime;
	}

	@Bean
	public String getHost() {
		return host;
	}

	@Bean
	public String getAccessKeyId() {
		return accessKeyId;
	}

	@Bean
	public String getAccessKeySecret() {
		return accessKeySecret;
	}

	@PreDestroy
	public void onDestroy() {

		if (ossClient != null) {
			ossClient.shutdown();
		}
	}

}
