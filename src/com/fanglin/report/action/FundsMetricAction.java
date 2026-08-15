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
import com.fanglin.report.service.FundsMetricService;
import com.fanglin.report.vo.FundsTrendVO;

/**
 * 资金闭环指标报表入口。
 *
 * <p>资金三段趋势（报价/签约/实收 + 退款）+ 手动刷新。
 * 数据来源 report.metric_funds_monthly，由定时任务每日凌晨刷新。
 *
 * <p>口径提示：报价/签约按签约月，收款/退款按收款月，两条时间轴并行对比。
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class FundsMetricAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private FundsMetricService fundsMetricService;

	private List<FundsTrendVO> fundsTrend;

	@Action(value = "queryFundsTrend", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFundsTrend() throws FLException {

		fundsTrend = fundsMetricService.queryFundsTrend(getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "refreshFundsMetric", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refreshFundsMetric() throws FLException {

		fundsMetricService.refreshMetric();

		return SUCCESS;
	}

	public List<FundsTrendVO> getFundsTrend() {
		return fundsTrend;
	}

	public void setFundsTrend(List<FundsTrendVO> fundsTrend) {
		this.fundsTrend = fundsTrend;
	}

}
