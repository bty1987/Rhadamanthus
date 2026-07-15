package com.fanglin.postar.action;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.postar.service.PostarService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PostarAction extends BaseListAction {

	private static final long serialVersionUID = 7617410252223827299L;

	@Autowired
	private PostarService postarService;

	private Wxpay wxpay;

	private String rspCod = "";

	private String rspMsg = "success";

	@Action(value = "callbackPostar", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String callbackPostar() throws FLException {

		JSONObject params = JSONObject.parseObject(getRequestPostData(request));

		try {
			postarService.callbackPostar(params);
		} catch (FLException e) {
			System.out.println(params);
			System.out.println(e.getCode() + ":" + e.getMessage());
			throw e;
		}

		return SUCCESS;
	}

	private String getRequestPostData(HttpServletRequest request) {

		try {
			int contentLength = request.getContentLength();

			if (contentLength < 0) {
				return "";
			}

			byte buffer[] = new byte[contentLength];

			for (int i = 0; i < contentLength;) {
				int len = request.getInputStream().read(buffer, i, contentLength - i);

				if (len == -1) break;

				i += len;
			}
			return new String(buffer, "utf-8");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return "";
		}
	}

	public Wxpay getWxpay() {
		return wxpay;
	}

	public void setWxpay(Wxpay wxpay) {
		this.wxpay = wxpay;
	}

	public String getRspCod() {
		return rspCod;
	}

	public void setRspCod(String rspCod) {
		this.rspCod = rspCod;
	}

	public String getRspMsg() {
		return rspMsg;
	}

	public void setRspMsg(String rspMsg) {
		this.rspMsg = rspMsg;
	}

}
