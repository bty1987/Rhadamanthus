package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.MerchantService;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MerchantAction extends BaseListAction {

	private static final long serialVersionUID = 6243727024524342670L;

	@Autowired
	private MerchantService merchantService;

	private List<UserVO> merchants;

	private UserVO merchant;

	@Action(value = "pageMerchant", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMerchant() throws FLException {

		merchantService.pageMerchant(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryMerchantByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMerchantByPinyin() throws FLException {

		merchants = merchantService.queryMerchantByPinyin(merchant.getPinYin());

		return SUCCESS;
	}

	public UserVO getMerchant() {
		return merchant;
	}

	public void setMerchant(UserVO merchant) {
		this.merchant = merchant;
	}

	public List<UserVO> getMerchants() {
		return merchants;
	}

	public void setMerchants(List<UserVO> merchants) {
		this.merchants = merchants;
	}

}
