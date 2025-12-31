/**
 * @File Name		: WeChatAppAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信小程序控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatGroupInfoVO;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信小程序控制器 处理微信小程序登录、用户信息获取、手机号获取等功能
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatAppAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730322L;

	@Autowired
	private WeChatAppService weChatAppService;

	/**
	 * 微信登录 code
	 */
	private String code;

	/**
	 * 加密数据
	 */
	private String encryptedData;

	/**
	 * 加密向量
	 */
	private String iv;

	/**
	 * 公司标识
	 */
	private String company;

	/**
	 * 微信用户信息
	 */
	private WeChatUserInfoVO userInfo;

	/**
	 * 微信群组信息
	 */
	private WeChatGroupInfoVO groupInfo;

	/**
	 * 手机号信息
	 */
	private WeChatPhoneInfoVO phoneInfo;

	/**
	 * 创建小程序 Session
	 * 
	 * @return 成功
	 */
	@Action(value = "makeWeChatAppSession", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeSession() throws FLException {

		userInfo = weChatAppService.makeSession(code, company);

		return SUCCESS;
	}

	/**
	 * 获取用户信息（重新获取 session_key）
	 * 
	 * @return 成功
	 */
	@Action(value = "queryWeChatAppUserInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserInfoWithCompany() throws FLException {

		userInfo = weChatAppService.queryUserInfo(code, encryptedData, iv, company);

		return SUCCESS;
	}

	/**
	 * 获取用户信息（使用缓存的 session_key）
	 * 
	 * @return 成功
	 */
	@Action(value = "queryWeChatAppUserInfoByCache", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserInfoByCache() throws FLException {

		userInfo = weChatAppService.queryUserInfo(code, encryptedData, iv);

		return SUCCESS;
	}

	/**
	 * 获取群组信息
	 * 
	 * @return 成功
	 */
	@Action(value = "queryWeChatAppGroupInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGroupInfo() throws FLException {

		groupInfo = weChatAppService.queryGroupInfo(code, encryptedData, iv);

		return SUCCESS;
	}

	/**
	 * 获取手机号信息
	 * 
	 * @return 成功
	 */
	@Action(value = "queryWeChatAppPhoneInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPhoneInfo() throws FLException {

		phoneInfo = weChatAppService.queryPhoneInfo(code, company);

		return SUCCESS;
	}

	/**
	 * 删除过期的 Session
	 * 
	 * @return 成功
	 */
	@Action(value = "deleteWeChatAppSession", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSession() {

		weChatAppService.deleteSession();

		return SUCCESS;
	}

	// Getters and Setters

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getEncryptedData() {
		return encryptedData;
	}

	public void setEncryptedData(String encryptedData) {
		this.encryptedData = encryptedData;
	}

	public String getIv() {
		return iv;
	}

	public void setIv(String iv) {
		this.iv = iv;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public WeChatUserInfoVO getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(WeChatUserInfoVO userInfo) {
		this.userInfo = userInfo;
	}

	public WeChatGroupInfoVO getGroupInfo() {
		return groupInfo;
	}

	public void setGroupInfo(WeChatGroupInfoVO groupInfo) {
		this.groupInfo = groupInfo;
	}

	public WeChatPhoneInfoVO getPhoneInfo() {
		return phoneInfo;
	}

	public void setPhoneInfo(WeChatPhoneInfoVO phoneInfo) {
		this.phoneInfo = phoneInfo;
	}

}
