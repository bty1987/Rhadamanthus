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

	public List<QuotetionFunctionAreaParamPO> queryQuotetionFunctionAreaParam(long qfaId);

	public int copyQuotetionFunctionAreaParam(long sfaid, long tfaid);

}
