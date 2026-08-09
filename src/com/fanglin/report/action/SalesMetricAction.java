package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.SalesMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 主材销售指标报表入口。
 *
 * <p>销售趋势（单量+总额双线）+ 品类结构饼图 + 手动刷新。
 * 数据来源 report.metric_sales_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private SalesMetricService salesMetricService;

	private List<MetricDualTrendVO> salesTrend;

	private List<MetricPointVO> categoryDist;

	@Action(value = "querySalesTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesTrend() throws FLException {

		salesTrend = salesMetricService.querySalesTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySalesCategoryDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesCategoryDist() throws FLException {

		categoryDist = salesMetricService.queryCategoryDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshSalesMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshSalesMetric() throws FLException {

		salesMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getSalesTrend() {
		return salesTrend;
	}

	public void setSalesTrend(List<MetricDualTrendVO> salesTrend) {
		this.salesTrend = salesTrend;
	}

	public List<MetricPointVO> getCategoryDist() {
		return categoryDist;
	}

	public void setCategoryDist(List<MetricPointVO> categoryDist) {
		this.categoryDist = categoryDist;
	}

}
