/**
 * @File Name		: WMCodeAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2016-6-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.WMCodeUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WMCodeAction extends BaseAction {

	private static final long serialVersionUID = 8870921012656189842L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	private String watermark;

	@Action(value = "wmCode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String wmCode() throws Exception {

		try {
			watermark = WMCodeUtil.createImage(queryUserName(), DateUtil.current("yyyyMMdd"));
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");

			LogUtils.logging(logger, e, "wmCode", "common");
		}

		return SUCCESS;
	}

	public String getWatermark() {
		return watermark;
	}

	public void setWatermark(String watermark) {
		this.watermark = watermark;
	}

}