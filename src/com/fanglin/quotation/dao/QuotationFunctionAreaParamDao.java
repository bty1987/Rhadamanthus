package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;

public interface QuotationFunctionAreaParamDao extends Dao<QuotationFunctionAreaParamPO> {

	public QuotationFunctionAreaParamPO queryQuotationFunctionAreaParam(Long qfaid);

	public List<QuotationFunctionAreaParamPO> queryQuotationFunctionAreaParamByQfaid(Long qfaid);

	public int copyQuotationFunctionAreaParam(long sqfaid, long tqfaid);

	/**
	 * 跨表复制：quotation 参数表 → quotetion 参数表
	 * @param sqfaid 源功能区 ID（quotation）
	 * @param tqfaid 目标功能区 ID（quotetion）
	 * @return 复制记录数
	 */
	public int copyQuotationToQuotetionParam(long sqfaid, long tqfaid);

}
