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
import com.aliyun.oss.model.ResponseHeaderOverrides;
import com.fanglin.aliyun.config.OssProperties;
import com.fanglin.aliyun.dao.OssConfigDao;
import com.fanglin.aliyun.po.OssConfigPO;
import com.fanglin.aliyun.service.OssConfigService;
import com.fanglin.aliyun.service.StsTokenService;
import com.fanglin.aliyun.vo.OssConfigVO;
import com.fanglin.aliyun.vo.StsTokenVO;
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

				ossClient = new OSSClientBuilder().build("https://" + ossConfigPO.getEndpoint(), ossConfigPO.getAccessKeyId(), ossConfigPO.getAccessKeySecret());

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

	@Autowired
	private StsTokenService stsTokenService;

	@Override
	public OssConfigVO getProgressiveImage(OssConfigVO ossConfig) {

		// STS通道优先:用读角色临时凭证预签名(私有桶OSS原生显示,不走文件服务器showImg.do)
		// 单次调用同时签原图(url)与缩略图(thumbUrl),凭证由StsTokenService缓存复用,避免图片墙批量撞STS限流
		if (ossProperties.isEnabled()) {

			try {

				StsTokenVO sts = stsTokenService.assumeReadToken("presign");

				OSS ossClient = null;

				try {

					// endpoint带https前缀: 预签名URL协议跟随endpoint scheme, 页面https下http链接会被浏览器按混合内容拦截
					ossClient = new OSSClientBuilder().build("https://" + ossProperties.getEndpoint(), sts.getAccessKeyId(), sts.getAccessKeySecret(), sts.getSecurityToken());

					String objectName = String.format("%s%s", ossConfig.getDir() == null ? "" : ossConfig.getDir(), ossConfig.getKey());
					String bucket = ossConfig.getBucket() != null ? ossConfig.getBucket() : sts.getBucket();

					// 存在性检查可关(oss.presign.checkExistence=false,默认关): HEAD请求是图片墙批量显示的主要开销,
					// 预签名本身不依赖存在性,不存在的对象由浏览器404兜底;开启时行为同旧版(缺失对象不回URL)
					if (!ossProperties.isPresignCheckExistence() || ossClient.doesObjectExist(bucket, objectName)) {

						Date expiration = new Date(System.currentTimeMillis() + ossProperties.getPresignExpireSeconds() * 1000);

						GeneratePresignedUrlRequest req = new GeneratePresignedUrlRequest(bucket, objectName, HttpMethod.GET);
						req.setExpiration(expiration);
	
						// 下载模式: 附attachment下载头, 文件名取key末段(UTF-8编码兼容中文名)
						if (Boolean.TRUE.equals(ossConfig.getDownload())) {
							ResponseHeaderOverrides overrides = new ResponseHeaderOverrides();
							String baseName = objectName.substring(objectName.lastIndexOf('/') + 1);
							overrides.setContentDisposition("attachment; filename*=UTF-8''" + java.net.URLEncoder.encode(baseName, "UTF-8"));
							req.setResponseHeaders(overrides);
						}

						ossConfig.setUrl(ossClient.generatePresignedUrl(req).toString());

						if (ossConfig.getWidth() != null && ossConfig.getHeight() != null) {
							GeneratePresignedUrlRequest thumbReq = new GeneratePresignedUrlRequest(bucket, objectName, HttpMethod.GET);
							thumbReq.setExpiration(expiration);
							thumbReq.setProcess(String.format("image/resize,m_fill,w_%s,h_%s", ossConfig.getWidth(), ossConfig.getHeight()));
							ossConfig.setThumbUrl(ossClient.generatePresignedUrl(thumbReq).toString());
						}
					}

					return ossConfig;

				} finally {
					if (ossClient != null) {
						ossClient.shutdown();
					}
				}

			} catch (Exception e) {
				logger.error("STS预签名失败,回退旧Policy通道", e);
			}
		}

		OssConfigPO ossConfigPO = ossConfigDao.querySignature(ossConfig.getAccessKeyId(), ossConfig.getEndpoint(), ossConfig.getBucket(), ossConfig.getDir());

		OSS ossClient = null;

		if (ossConfigPO == null) {
			return ossConfig;
		}

		try {

			ossClient = new OSSClientBuilder().build("https://" + ossConfigPO.getEndpoint(), ossConfigPO.getAccessKeyId(), ossConfigPO.getAccessKeySecret());

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
