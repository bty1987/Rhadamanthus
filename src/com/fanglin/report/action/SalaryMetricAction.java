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
import com.fanglin.report.service.SalaryMetricService;
import com.fanglin.report.vo.MetricDualTrendVO;
import com.fanglin.report.vo.MetricPointVO;

/**
 * 人力薪酬指标报表入口。
 *
 * <p>工费趋势（单量/实发双线）+ 工种结构饼图 + 手动刷新。
 * 数据来源 report.metric_salary_monthly，由定时任务每日凌晨刷新。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class SalaryMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private SalaryMetricService salaryMetricService;

	private List<MetricDualTrendVO> salaryTrend;

	private List<MetricPointVO> workerTypeDist;

	@Action(value = "querySalaryMetricTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalaryMetricTrend() throws FLException {

		salaryTrend = salaryMetricService.querySalaryTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySalaryWorkerTypeDist", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalaryWorkerTypeDist() throws FLException {

		workerTypeDist = salaryMetricService.queryWorkerTypeDist(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshSalaryMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshSalaryMetric() throws FLException {

		salaryMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<MetricDualTrendVO> getSalaryTrend() {
		return salaryTrend;
	}

	public void setSalaryTrend(List<MetricDualTrendVO> salaryTrend) {
		this.salaryTrend = salaryTrend;
	}

	public List<MetricPointVO> getWorkerTypeDist() {
		return workerTypeDist;
	}

	public void setWorkerTypeDist(List<MetricPointVO> workerTypeDist) {
		this.workerTypeDist = workerTypeDist;
	}

}
