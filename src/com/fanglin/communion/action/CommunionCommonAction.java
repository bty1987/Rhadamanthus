package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.ChartService;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.ChartVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("common")
@Namespace("/")
@Controller
public class CommunionCommonAction extends BaseListAction {

	private static final long serialVersionUID = -2218803921837474715L;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private ChartService chartService;

	private CustomerVO customer;

	private String imgbase;

	private ChartVO chart;

	private List<ChartVO> charts;

	@Action(value = "signateCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String signateCustomer() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		customerService.signateCustomer(customer, imgbase);

		return "success";
	}

	@Action(value = "queryChart", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChart() throws FLException {

		charts = chartService.queryChart(chart);

		return SUCCESS;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getImgbase() {
		return imgbase;
	}

	public void setImgbase(String imgbase) {
		this.imgbase = imgbase;
	}

	public ChartVO getChart() {
		return chart;
	}

	public void setChart(ChartVO chart) {
		this.chart = chart;
	}

	public List<ChartVO> getCharts() {
		return charts;
	}

	public void setCharts(List<ChartVO> charts) {
		this.charts = charts;
	}

}
