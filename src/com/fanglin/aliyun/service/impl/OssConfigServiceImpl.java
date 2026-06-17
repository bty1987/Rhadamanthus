package com.fanglin.aliyun.service.impl;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.utils.BinaryUtil;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyun.oss.model.MatchMode;
import com.aliyun.oss.model.PolicyConditions;
import com.fanglin.aliyun.config.OssProperties;
import com.fanglin.aliyun.dao.OssConfigDao;
import com.fanglin.aliyun.po.OssConfigPO;
import com.fanglin.aliyun.service.OssConfigService;
import com.fanglin.aliyun.vo.OssConfigVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("ossConfigService")
@Transactional(readOnly = true)
public class OssConfigServiceImpl implements OssConfigService {

	public static final Logger logger = LoggerFactory.getLogger(OssConfigServiceImpl.class);

	@Autowired
	private OssConfigDao ossConfigDao;

	@Autowired
	private OssProperties ossProperties;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public OssConfigVO generatePostSignature(OssConfigVO ossConfig) {

		OssConfigPO ossConfigPO = ossConfigDao.querySignature(ossConfig.getAccessKeyId(), ossConfig.getEndpoint(), ossConfig.getBucket(), ossConfig.getDir());

		if (ossConfigPO == null) {
			return ossConfig;
		}

		if (ossConfigPO.getDeadline().getTime() < DateUtil.getDateToTimestamp(new Date()).getTime()) {

			OSS ossClient = null;

			try {

				ossClient = new OSSClientBuilder().build(ossConfigPO.getEndpoint(), ossConfigPO.getAccessKeyId(), ossConfigPO.getAccessKeySecret());

				long expireEndTime = System.currentTimeMillis() + ossConfigPO.getExpireTime() * 1000;
				Date expiration = new Date(expireEndTime);
				PolicyConditions policyConds = new PolicyConditions();
				policyConds.addConditionItem(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, 1048576000);
				policyConds.addConditionItem(MatchMode.StartWith, PolicyConditions.COND_KEY, ossConfig.getDir());
				String postPolicy = ossClient.generatePostPolicy(expiration, policyConds);
				byte[] binaryData = postPolicy.getBytes("utf-8");
				String encodedPolicy = BinaryUtil.toBase64String(binaryData);
				String postSignature = ossClient.calculatePostSignature(postPolicy);

				ossConfigPO.setPolicy(encodedPolicy);
				ossConfigPO.setSignature(postSignature);
				ossConfigPO.setDeadline(DateUtil.getDateToTimestamp(expiration));

				ossConfigDao.update(ossConfigPO);

				BeanUtil.copyProperties(ossConfigPO, ossConfig, Arrays.asList("ossClient"));

				ossConfig.setHost(String.format("https://%s.%s", ossConfigPO.getBucket(), ossConfigPO.getEndpoint()));
				ossConfig.setPolicy(encodedPolicy);
				ossConfig.setSignature(postSignature);

			} catch (OSSException oe) {
				String ossErrorMsg = String.format("验证失败,重新验证 [OSS服务端错误：错误码=%s, 请求ID=%s, 详情=%s]", oe.getErrorCode(), oe.getRequestId(), oe.getErrorMessage());
				logger.error(ossErrorMsg, oe);
			} catch (ClientException ce) {
				String clientErrorMsg = String.format("验证失败,重新验证 [客户端通信失败：详情=%s]", ce.getMessage());
				logger.error(clientErrorMsg, ce);
			} catch (UnsupportedEncodingException e) {
				String errorMsg = String.format("验证失败,重新验证 [编码异常：不支持的字符集，详情=%s]", e.getMessage());
				logger.error(errorMsg, e);
			} finally {
				if (ossClient != null) {
					ossClient.shutdown();
				}
			}
		} else {

			BeanUtil.copyProperties(ossConfigPO, ossConfig, Arrays.asList("ossClient"));

			ossConfig.setHost(String.format("https://%s.%s", ossConfigPO.getBucket(), ossConfigPO.getEndpoint()));
			ossConfig.setPolicy(ossConfigPO.getPolicy());
			ossConfig.setSignature(ossConfigPO.getSignature());
		}

		return ossConfig;
	}

	@Override
	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig) {

		OssConfigPO ossConfigPO = ossConfigDao.querySignature(ossConfig.getAccessKeyId(), ossConfig.getEndpoint(), ossConfig.getBucket(), ossConfig.getDir());

		OSS ossClient = null;

		if (ossConfigPO == null) {
			return ossConfig;
		}

		try {

			ossClient = new OSSClientBuilder().build(ossConfigPO.getEndpoint(), ossConfigPO.getAccessKeyId(), ossConfigPO.getAccessKeySecret());

			String objectName = String.format("%s%s", ossConfig.getDir(), ossConfig.getKey());

			if (ossClient.doesObjectExist(ossConfig.getBucket(), objectName)) { // 判断图片信息

				Date expiration = new Date(System.currentTimeMillis() + ossProperties.getPresignExpireSeconds() * 1000);
				GeneratePresignedUrlRequest req = new GeneratePresignedUrlRequest(ossConfigPO.getBucket(), objectName, HttpMethod.GET);
				if (ossConfig.getWidth() != null && ossConfig.getHeight() != null) {
					String style = String.format("image/resize,m_fill,w_%s,h_%s", ossConfig.getWidth(), ossConfig.getHeight());
					req.setProcess(style);
				}
				req.setExpiration(expiration);

				ossConfig.setUrl(ossClient.generatePresignedUrl(req).toString());
			}
		} catch (OSSException oe) {
			String ossErrorMsg = String.format("验证失败,重新验证 [OSS服务端错误：错误码=%s, 请求ID=%s, 详情=%s]", oe.getErrorCode(), oe.getRequestId(), oe.getErrorMessage());
			logger.error(ossErrorMsg, oe);
		} catch (ClientException ce) {
			String clientErrorMsg = String.format("验证失败,重新验证 [客户端通信失败：详情=%s]", ce.getMessage());
			logger.error(clientErrorMsg, ce);
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}

		return ossConfig;
	}
}
