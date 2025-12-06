package com.fanglin.aliyun.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.aliyun.service.OssConfigService;
import com.fanglin.aliyun.vo.OssConfigVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OssConfigAction extends BaseListAction {

	private static final long serialVersionUID = 524274934633184177L;

	@Autowired
	private OssConfigService ossConfigService;

	private OssConfigVO ossConfig;

	@Action(value = "generatePostSignature", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String generatePostSignature() {

		ossConfigService.generatePostSignature(ossConfig);

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
}
