/**
 * @File Name		: CityCountAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2016-11-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.report.service.CityCountService;
import com.fanglin.report.service.CityProperCountService;
import com.fanglin.report.vo.CityCountDetailVO;
import com.fanglin.report.vo.CityProperCountDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityCountAction extends BaseListAction {

	private static final long serialVersionUID = -4079568985107136807L;
	
	@Autowired
	private CityCountService cityCountService;
	
	@Autowired
	private CityProperCountService cityProperCountService;
	
	private List<CityCountDetailVO> cityCounts;
	
	private List<CityProperCountDetailVO> cityProperCounts;
	
	@Action(value="reportCityCountForCurrent", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String reportCityCountForCurrent() throws ParseException{
		
		cityCounts = cityCountService.queryCityCountDetailByCurrent(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="reportCityProperCountForCurrent", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String reportCityProperCountForCurrent() throws ParseException{
		
		cityProperCounts = cityProperCountService.queryCityProperCountDetailByCurrent(getFilters());
		
		return SUCCESS;
	}

	public List<CityCountDetailVO> getCityCounts() {
		return cityCounts;
	}

	public void setCityCounts(List<CityCountDetailVO> cityCounts) {
		this.cityCounts = cityCounts;
	}

	public List<CityProperCountDetailVO> getCityProperCounts() {
		return cityProperCounts;
	}

	public void setCityProperCounts(List<CityProperCountDetailVO> cityProperCounts) {
		this.cityProperCounts = cityProperCounts;
	}

}
