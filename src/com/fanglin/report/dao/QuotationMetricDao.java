package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.QuotationMonthlyMetricPO;
import com.fanglin.report.vo.MetricDualTrendVO;

/**
 * 报价偏差指标汇总 DAO。
 */
public interface QuotationMetricDao extends Dao<QuotationMonthlyMetricPO> {

	/** 全量重算报价偏差月级汇总。 */
	void rebuild();

	/** 报价 vs 签约趋势：value1=平均报价额，value2=平均签约额。 */
	List<MetricDualTrendVO> queryQuotationSignTrend(List<Filter> filters, int company);

}
