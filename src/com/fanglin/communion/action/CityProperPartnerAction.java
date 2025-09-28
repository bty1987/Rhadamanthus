package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CityProperPartnerService;
import com.fanglin.communion.vo.CityProperPartnerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityProperPartnerAction extends BaseListAction {

	private static final long serialVersionUID = 7018669161903077845L;

	@Autowired
	private CityProperPartnerService cityProperPartnerService;

	private List<CityProperPartnerVO> cityProperPartners;

	private CityProperPartnerVO cityProperPartner;

	@Action(value = "queryCityProperPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProperPartner() throws FLException {

		cityProperPartners = cityProperPartnerService.queryCityProperPartner(cityProperPartner);

		return SUCCESS;
	}

	@Action(value = "addCityProperPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCityProperPartner() throws FLException {

		cityProperPartnerService.addCityProperPartner(cityProperPartner, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteCityProperPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCityProperPartner() throws FLException {

		cityProperPartnerService.deleteCityProperPartner(cityProperPartner);

		return SUCCESS;
	}

	public List<CityProperPartnerVO> getCityProperPartners() {
		return cityProperPartners;
	}

	public void setCityProperPartners(List<CityProperPartnerVO> cityProperPartners) {
		this.cityProperPartners = cityProperPartners;
	}

	public CityProperPartnerVO getCityProperPartner() {
		return cityProperPartner;
	}

	public void setCityProperPartner(CityProperPartnerVO cityProperPartner) {
		this.cityProperPartner = cityProperPartner;
	}
}
