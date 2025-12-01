package com.fanglin.system.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.common.utils.BinaryUtil;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.aliyun.oss.model.MatchMode;
import com.aliyun.oss.model.PolicyConditions;
import com.fanglin.system.po.OssConfigPO;
import com.fanglin.system.service.OssConfigService;
import com.fanglin.system.vo.OssConfigVO;

@Service("ossConfigService")
@Transactional(readOnly = true)
public class OssConfigServiceImpl implements OssConfigService {

	public static final Logger logger = LoggerFactory.getLogger(OssConfigServiceImpl.class);

	@Autowired
	private OSS ossClient;

	@Autowired
	private OssConfigPO ossConfigPO;

	@Override
	public OssConfigVO generatePostSignature() {

		OssConfigVO ossConfigVO = new OssConfigVO();

		try {
			long expireEndTime = System.currentTimeMillis() + ossConfigPO.getExpireTime() * 1000;
			Date expiration = new Date(expireEndTime);
			PolicyConditions policyConds = new PolicyConditions();
			policyConds.addConditionItem(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, 1048576000);
			policyConds.addConditionItem(MatchMode.StartWith, PolicyConditions.COND_KEY, ossConfigPO.getDir());
			String postPolicy = ossClient.generatePostPolicy(expiration, policyConds);
			byte[] binaryData = postPolicy.getBytes("utf-8");
			String encodedPolicy = BinaryUtil.toBase64String(binaryData);
			String postSignature = ossClient.calculatePostSignature(postPolicy);

			ossConfigVO.setAccessKeyId(ossConfigPO.getAccessKeyId());
			ossConfigVO.setPolicy(encodedPolicy);
			ossConfigVO.setSignature(postSignature);
			ossConfigVO.setDir(ossConfigPO.getDir());
			ossConfigVO.setHost(ossConfigPO.getHost());

		} catch (OSSException oe) {
			String ossErrorMsg = String.format("验证失败,重新验证 [OSS服务端错误：错误码=%s, 请求ID=%s, 详情=%s]", oe.getErrorCode(), oe.getRequestId(), oe.getErrorMessage());
			logger.error(ossErrorMsg, oe);
		} catch (ClientException ce) {
			String clientErrorMsg = String.format("验证失败,重新验证 [客户端通信失败：详情=%s]", ce.getMessage());
			logger.error(clientErrorMsg, ce);
		} catch (UnsupportedEncodingException e) {
			String errorMsg = String.format("验证失败,重新验证 [编码异常：不支持的字符集，详情=%s]", e.getMessage());
			logger.error(errorMsg, e);
		}

		return ossConfigVO;
	}

	@Override
	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig) {

		String objectName = ossConfigPO.getDir() + ossConfig.getKey();

		try {

			if (ossClient.doesObjectExist(ossConfigPO.getBucket(), objectName)) { // 判断图片信息
				String style = "image/resize,m_pad,w_150,h_150";
				Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 10);
				GeneratePresignedUrlRequest req = new GeneratePresignedUrlRequest(ossConfigPO.getBucket(), objectName, HttpMethod.GET);
				req.setProcess(style);
				req.setExpiration(expiration);
				URL signedUrl = ossClient.generatePresignedUrl(req);

				ossConfig.setUrl(signedUrl.toString());
			}
		} catch (OSSException oe) {
			String ossErrorMsg = String.format("验证失败,重新验证 [OSS服务端错误：错误码=%s, 请求ID=%s, 详情=%s]", oe.getErrorCode(), oe.getRequestId(), oe.getErrorMessage());
			logger.error(ossErrorMsg, oe);
		} catch (ClientException ce) {
			String clientErrorMsg = String.format("验证失败,重新验证 [客户端通信失败：详情=%s]", ce.getMessage());
			logger.error(clientErrorMsg, ce);
		}

		return ossConfig;
	}

	@Override
	public int deleteImageSample(OssConfigVO ossConfig) {

		String objectName = ossConfigPO.getDir() + ossConfig.getKey();

		try {
			if (ossClient.doesObjectExist(ossConfigPO.getBucket(), objectName)) { // 判断图片信息
				ossClient.deleteObject(ossConfigPO.getBucket(), objectName);
			}
		} catch (OSSException oe) {
			String ossErrorMsg = String.format("验证失败,重新验证 [OSS服务端错误：错误码=%s, 请求ID=%s, 详情=%s]", oe.getErrorCode(), oe.getRequestId(), oe.getErrorMessage());
			logger.error(ossErrorMsg, oe);
		} catch (ClientException ce) {
			String clientErrorMsg = String.format("验证失败,重新验证 [客户端通信失败：详情=%s]", ce.getMessage());
			logger.error(clientErrorMsg, ce);
		}

		return 0;
	}
}
