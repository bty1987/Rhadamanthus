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
import com.fanglin.personel.service.AvengerService;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AvengerAction extends BaseListAction {

	private static final long serialVersionUID = 6243727024524342670L;

	@Autowired
	private AvengerService avengerService;

	private List<UserVO> avengers;

	private UserVO avenger;

	@Action(value = "pageAvenger", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAvenger() throws FLException {

		avengerService.pageAvenger(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryAvengerByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAvengerByPinyin() throws FLException {

		avengers = avengerService.queryAvengerByPinyin(avenger.getPinYin());

		return SUCCESS;
	}

	public UserVO getAvenger() {
		return avenger;
	}

	public void setAvenger(UserVO avenger) {
		this.avenger = avenger;
	}

	public List<UserVO> getAvengers() {
		return avengers;
	}

	public void setAvengers(List<UserVO> avengers) {
		this.avengers = avengers;
	}

}
