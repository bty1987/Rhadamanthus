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
import com.fanglin.market.service.EcityService;
import com.fanglin.market.vo.EcityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EcityAction extends BaseListAction {

	private static final long serialVersionUID = -4173487166794662751L;

	@Autowired
	private EcityService ecityService;

	private List<EcityVO> ecitys;

	private EcityVO ecity;

	private List<KeyValueVO> autoFillKeyValue;

	private List<String> autoFillList;

	@Action(value = "pageEcity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEcity() {

		ecityService.pageEcity(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEcity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcity() {

		ecitys = ecityService.queryEcity();

		return SUCCESS;
	}

	@Action(value = "queryEcityByPinYin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcityByPinYin() {

		ecitys = ecityService.queryEcityByPinYin(ecity);

		packageEuserName(ecitys);

		return SUCCESS;
	}

	@Action(value = "addEcity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEcity() {

		ecityService.addEcity(ecity);

		return SUCCESS;
	}

	@Action(value = "updateEcity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateEcity() {

		ecityService.updateEcity(ecity);

		return SUCCESS;
	}

	private void packageEuserName(List<EcityVO> ecitys) {
		for (EcityVO ecity : ecitys) {
			KeyValueVO keyValueVO = new KeyValueVO();

			StringBuffer value = new StringBuffer();

			value.append(ecity.getCity());

			keyValueVO.setKey(String.valueOf(ecity.getEcid()));
			keyValueVO.setValue(value.toString());

			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(ecity.getCity());
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

	public List<EcityVO> getEcitys() {
		return ecitys;
	}

	public void setEcitys(List<EcityVO> ecitys) {
		this.ecitys = ecitys;
	}

	public EcityVO getEcity() {
		return ecity;
	}

	public void setEcity(EcityVO ecity) {
		this.ecity = ecity;
	}

}
