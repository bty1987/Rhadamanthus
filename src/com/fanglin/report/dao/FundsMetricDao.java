package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.FundsMonthlyMetricPO;
import com.fanglin.report.vo.FundsTrendVO;

/**
 * 资金闭环指标汇总 DAO。
 */
public interface FundsMetricDao extends Dao<FundsMonthlyMetricPO> {

	/** 全量重算资金闭环月级汇总（INSERT ... ON DUPLICATE KEY UPDATE）。 */
	void rebuild();

	/** 资金三段趋势：按月返回总报价额/总签约额/总收款/总退款。 */
	List<FundsTrendVO> queryFundsTrend(List<Filter> filters, int company);

}
