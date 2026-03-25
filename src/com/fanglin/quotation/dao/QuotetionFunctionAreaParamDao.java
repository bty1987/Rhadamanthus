package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotetionFunctionAreaParamPO;

/**
 * 模板报价功能区参数 DAO
 * 
 * @author Clawd
 * @since 2026-02-23
 */
public interface QuotetionFunctionAreaParamDao extends Dao<QuotetionFunctionAreaParamPO> {

	public QuotetionFunctionAreaParamPO queryQuotetionFunctionAreaParam(Long qfaid);

	public List<QuotetionFunctionAreaParamPO> queryQuotetionFunctionAreaParamByQfaid(long qfaId);

	public int copyQuotetionFunctionAreaParam(long sfaid, long tfaid);

	/**
	 * 跨表复制：quotetion 参数表 → quotation 参数表
	 * @param sqfaid 源功能区 ID（quotetion）
	 * @param tqfaid 目标功能区 ID（quotation）
	 * @return 复制记录数
	 */
	public int copyQuotetionToQuotationParam(long sqfaid, long tqfaid);

}
