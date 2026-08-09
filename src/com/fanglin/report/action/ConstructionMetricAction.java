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
import com.fanglin.report.service.ConstructionMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 施工履约指标报表入口。
 *
 * <p>开工/完工趋势 + 工期对比 + 超期分布 + 手动刷新。
 * 数据来源 report.metric_construction_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ConstructionMetricService constructionMetricService;

	private List<MetricDualTrendVO> startFinishTrend;

	private List<MetricDualTrendVO> periodTrend;

	private List<MetricPointVO> overdueDist;

	@Action(value = "queryConstructionStartFinishTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionStartFinishTrend() throws FLException {

		startFinishTrend = constructionMetricService.queryStartFinishTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionPeriodTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPeriodTrend() throws FLException {

		periodTrend = constructionMetricService.queryPeriodTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionOverdueDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionOverdueDist() throws FLException {

		overdueDist = constructionMetricService.queryOverdueDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshConstructionMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshConstructionMetric() throws FLException {

		constructionMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getStartFinishTrend() {
		return startFinishTrend;
	}

	public void setStartFinishTrend(List<MetricDualTrendVO> startFinishTrend) {
		this.startFinishTrend = startFinishTrend;
	}

	public List<MetricDualTrendVO> getPeriodTrend() {
		return periodTrend;
	}

	public void setPeriodTrend(List<MetricDualTrendVO> periodTrend) {
		this.periodTrend = periodTrend;
	}

	public List<MetricPointVO> getOverdueDist() {
		return overdueDist;
	}

	public void setOverdueDist(List<MetricPointVO> overdueDist) {
		this.overdueDist = overdueDist;
	}

}
