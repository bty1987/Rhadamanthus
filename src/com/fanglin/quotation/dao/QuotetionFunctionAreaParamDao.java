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

	/**
	 * 根据功能区ID查询参数
	 *
	 * @param qfaId 功能区ID
	 * @return 功能区参数
	 */
	public QuotetionFunctionAreaParamPO queryQuotetionFunctionAreaParam(Long qfaId);

	/**
	 * 根据功能区ID查询参数列表（扩展用）
	 *
	 * @param qfaId 功能区ID
	 * @return 功能区参数列表
	 */
	public List<QuotetionFunctionAreaParamPO> queryQuotetionFunctionAreaParamByQfaId(Long qfaId);

}
