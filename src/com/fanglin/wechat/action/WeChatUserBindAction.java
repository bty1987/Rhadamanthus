/**
 * @File Name		: WeChatUserBindAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wechat.service.WeChatUserBindService;
import com.fanglin.wechat.vo.WeChatUserBindVO;

/**
 * 微信用户绑定控制器
 * 用于管理微信用户与系统用户的绑定关系
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatUserBindAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730326L;

	@Autowired
	private WeChatUserBindService weChatUserBindService;

	/**
	 * 微信用户绑定对象
	 */
	private WeChatUserBindVO userBindVO;

	/**
	 * 查询微信用户绑定的系统用户
	 * @return 成功
	 */
	@Action(value = "queryWeChatUserBind", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String queryUserBind() {

		userBindVO = weChatUserBindService.queryUserBind(userBindVO);

		return SUCCESS;
	}

	/**
	 * 添加或更新微信用户绑定
	 * @return 成功
	 */
	@Action(value = "addWeChatUserBind", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String addUserBind() {

		weChatUserBindService.addUserBind(userBindVO);

		return SUCCESS;
	}

	/**
	 * 删除微信用户绑定
	 * @return 成功
	 */
	@Action(value = "deleteWeChatUserBind", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String deleteUserBind() {

		weChatUserBindService.deleteUserBind(userBindVO);

		return SUCCESS;
	}

	// Getters and Setters

	public WeChatUserBindVO getUserBindVO() {
		return userBindVO;
	}

	public void setUserBindVO(WeChatUserBindVO userBindVO) {
		this.userBindVO = userBindVO;
	}

}
