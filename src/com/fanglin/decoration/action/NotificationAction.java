package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.NotificationService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NotificationAction extends BaseAction {

	private static final long serialVersionUID = -3189624715024527674L;

	private Long userId;
	private String message;
	private String type;

	@org.springframework.beans.factory.annotation.Autowired
	private NotificationService notificationService;

	@Action(value = "sendDingtalk", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDingtalk() throws FLException {

		notificationService.sendDingtalk(userId, message, type);

		return SUCCESS;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
