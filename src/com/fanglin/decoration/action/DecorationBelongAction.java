/**
 * @File Name		: OrderBelongInfoAction
 * @Package   	: com.fanglin.action.orderBelongInfo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationBelongAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private DecorationBelongService decorationBelongService;

	private DecorationBelongVO decorationBelong;

	private List<DecorationBelongVO> decorationBelongs;

	private DecorationVO decoration;

	private String securityCode;

	private String verifyCode;

	private String phoneCode;

	private String company;

	@Action(value = "queryDecorationBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBelong() {

		decorationBelongs = decorationBelongService.queryDecorationBelong(decorationBelong);

		return SUCCESS;
	}

	@Action(value = "sendDecorationBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationBelong() throws FLException {

		decorationBelongService.sendDecorationBelong(decorationBelong);

		return SUCCESS;
	}

	@Action(value = "confirmDecorationBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationBelong() throws FLException {

		decorationBelongService.confirmDecorationBelong(decoration, decorationBelong, securityCode, verifyCode, phoneCode, company);

		return SUCCESS;
	}

	@Action(value = "tranDecorationBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranDecorationBelong() throws FLException {

		decorationBelongService.tranDecorationBelong(decorationBelong, decorationBelongs);

		return SUCCESS;
	}

	public DecorationBelongVO getDecorationBelong() {
		return decorationBelong;
	}

	public void setDecorationBelong(DecorationBelongVO decorationBelong) {
		this.decorationBelong = decorationBelong;
	}

	public List<DecorationBelongVO> getDecorationBelongs() {
		return decorationBelongs;
	}

	public void setDecorationBelongs(List<DecorationBelongVO> decorationBelongs) {
		this.decorationBelongs = decorationBelongs;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public String getPhoneCode() {
		return phoneCode;
	}

	public void setPhoneCode(String phoneCode) {
		this.phoneCode = phoneCode;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
