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
import com.fanglin.report.service.InventoryMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 仓储物流指标报表入口。
 *
 * <p>出入库趋势（入库/出库双线）+ 类型结构饼图 + 手动刷新。
 * 数据来源 report.metric_inventory_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class InventoryMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private InventoryMetricService inventoryMetricService;

	private List<MetricDualTrendVO> inOutTrend;

	private List<MetricPointVO> typeDist;

	@Action(value = "queryInventoryInOutTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInventoryInOutTrend() throws FLException {

		inOutTrend = inventoryMetricService.queryInOutTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryInventoryTypeDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInventoryTypeDist() throws FLException {

		typeDist = inventoryMetricService.queryTypeDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshInventoryMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshInventoryMetric() throws FLException {

		inventoryMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getInOutTrend() {
		return inOutTrend;
	}

	public void setInOutTrend(List<MetricDualTrendVO> inOutTrend) {
		this.inOutTrend = inOutTrend;
	}

	public List<MetricPointVO> getTypeDist() {
		return typeDist;
	}

	public void setTypeDist(List<MetricPointVO> typeDist) {
		this.typeDist = typeDist;
	}

}
