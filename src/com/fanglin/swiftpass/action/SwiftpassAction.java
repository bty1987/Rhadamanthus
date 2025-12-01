package com.fanglin.swiftpass.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.swiftpass.service.SwiftpassService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SwiftpassAction extends BaseListAction {

	private static final long serialVersionUID = 2198804538629937340L;

	@Autowired
	private SwiftpassService swiftpassService;

	private String result = "success";

	@Action(value = "callbackSwiftpass", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String callbackSwiftpass() throws FLException {

		JSONObject params = getRequestPostData(request);

		try {
			swiftpassService.callbackSwiftpass(params);
		} catch (FLException e) {
			System.out.println(params);
			System.out.println(e.getCode() + ":" + e.getMessage());
			throw e;
		}

		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	private JSONObject getRequestPostData(HttpServletRequest request) {

		try {
			int contentLength = request.getContentLength();

			if (contentLength < 0) {
				return new JSONObject();
			}

			byte buffer[] = new byte[contentLength];

			for (int i = 0; i < contentLength;) {
				int len = request.getInputStream().read(buffer, i, contentLength - i);

				if (len == -1) break;

				i += len;
			}

			String data = new String(buffer, "utf-8");

			Document document = DocumentHelper.parseText(data);

			List<Element> list = document.getRootElement().elements();

			JSONObject jsonData = new JSONObject();

			for (int i = 0; i < list.size(); i++) {
				jsonData.put(list.get(i).getName(), list.get(i).getData());
			}

			return jsonData;

		} catch (Exception e) {
			System.out.println(e.getMessage());
			return new JSONObject();
		}
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

}
