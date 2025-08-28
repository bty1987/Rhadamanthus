package com.fanglin.market.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.EpersonService;
import com.fanglin.market.vo.EpersonVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EpersonAction extends BaseListAction {

	private static final long serialVersionUID = 7010027294928903314L;

	@Autowired
	private EpersonService epersonService;

	private List<EpersonVO> epersons;

	private EpersonVO eperson;

	private List<KeyValueVO> autoFillKeyValue;

	private List<String> autoFillList;

	@Action(value = "pageEperson", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEperson() {

		epersonService.pageEperson(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEperson", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEperson() {

		epersonService.pageEperson(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEpersonByEuid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEpersonByEuid() throws FLException {

		eperson = epersonService.queryEpersonByEuid(eperson);

		return SUCCESS;
	}

	@Action(value = "queryEpersonByPinYin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEpersonByPinYin() {

		epersons = epersonService.queryEpersonByPinYin(eperson);

		packageEpersonName(epersons);

		return SUCCESS;
	}

	@Action(value = "addEperson", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEperson() throws FLException {

		epersonService.addEperson(eperson);

		return SUCCESS;
	}

	@Action(value = "updateEperson", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateEperson() throws FLException {

		epersonService.updateEperson(eperson);

		return SUCCESS;
	}

	private void packageEpersonName(List<EpersonVO> epersons) {

		for (EpersonVO eperson : epersons) {

			KeyValueVO keyValueVO = new KeyValueVO();

			StringBuffer value = new StringBuffer();
			String type = "";

			if (eperson.getType() == 0) {
				type = "设计师";
			} else if (eperson.getType() == 1) {
				type = "监理";
			}
			value.append(eperson.getName());
			value.append("-");
			value.append(type);

			keyValueVO.setKey(String.valueOf(eperson.getEuid()));
			keyValueVO.setValue(value.toString());

			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(eperson.getName());
		}
	}

	public List<KeyValueVO> getAutoFillKeyValue() {

		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}

		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList() {

		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}

		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

	public List<EpersonVO> getEpersons() {
		return epersons;
	}

	public void setEpersons(List<EpersonVO> epersons) {
		this.epersons = epersons;
	}

	public EpersonVO getEperson() {
		return eperson;
	}

	public void setEperson(EpersonVO eperson) {
		this.eperson = eperson;
	}

}
