package com.fanglin.aliyun.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.aliyun.service.OssConfigService;
import com.fanglin.aliyun.service.StsTokenService;
import com.fanglin.aliyun.vo.OssConfigVO;
import com.fanglin.aliyun.vo.StsTokenVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OssConfigAction extends BaseListAction {

	private static final long serialVersionUID = 524274934633184177L;

	@Autowired
	private OssConfigService ossConfigService;

	@Autowired
	private StsTokenService stsTokenService;

	private OssConfigVO ossConfig;

	private StsTokenVO stsToken;

	/**
	 * 生成上传签名（旧 Policy 方式，保留用于并行灰度）
	 */
	@Action(value = "generatePostSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String generatePostSignature() {

		ossConfigService.generatePostSignature(ossConfig);

		return SUCCESS;
	}

	/**
	 * 获取 STS 上传临时凭证（推荐）
	 *
	 * 前端用返回的三元组（accessKeyId/accessKeySecret/securityToken）直传 OSS，
	 * 凭证默认 15 分钟失效，过期后重新申请。会话名取当前登录 userId，实现按用户目录隔离。
	 */
	@Action(value = "getOssStsToken", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getOssStsToken() throws FLException {

		try {
			String userId = queryUserId();
			stsToken = stsTokenService.assumeUploadToken(userId == null ? "anonymous" : userId);
		} catch (Exception e) {
			throw new FLException(110030, "获取OSS凭证失败");
		}

		return SUCCESS;
	}

	@Action(value = "getProgressiveImage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getProgressiveImage() {

		ossConfig = ossConfigService.getProgressiveImage(ossConfig);

		return SUCCESS;
	}

	public OssConfigVO getOssConfig() {
		return ossConfig;
	}

	public void setOssConfig(OssConfigVO ossConfig) {
		this.ossConfig = ossConfig;
	}

	public StsTokenVO getStsToken() {
		return stsToken;
	}

	public void setStsToken(StsTokenVO stsToken) {
		this.stsToken = stsToken;
	}

}
