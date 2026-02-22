package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotetionFunctionAreaParamDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaParamPO;

/**
 * 模板报价功能区参数 DAO 实现
 *
 * @author Clawd
 * @since 2026-02-23
 */
@Repository("QuotetionFunctionAreaParamDao")
public class QuotetionFunctionAreaParamDaoImpl extends DaoImpl<QuotetionFunctionAreaParamPO> implements QuotetionFunctionAreaParamDao {

	public QuotetionFunctionAreaParamDaoImpl() {
		super(QuotetionFunctionAreaParamPO.class);
	}

	@Override
	public QuotetionFunctionAreaParamPO queryQuotetionFunctionAreaParam(Long qfaId) {
		return (QuotetionFunctionAreaParamPO) session().createCriteria(QuotetionFunctionAreaParamPO.class)
				.add(Restrictions.eq("qfaId", qfaId))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotetionFunctionAreaParamPO> queryQuotetionFunctionAreaParamByQfaId(Long qfaId) {
		return createCriteria(QuotetionFunctionAreaParamPO.class)
				.add(Restrictions.eq("qfaId", qfaId))
				.list();
	}

}
