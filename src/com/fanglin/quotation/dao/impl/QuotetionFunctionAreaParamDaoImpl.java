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
	@SuppressWarnings("unchecked")
	public List<QuotetionFunctionAreaParamPO> queryQuotetionFunctionAreaParam(long qfaId) {
		return createCriteria(QuotetionFunctionAreaParamPO.class).add(Restrictions.eq("qfaId", qfaId)).list();
	}

	@Override
	public int copyQuotetionFunctionAreaParam(long sqfaid, long tqfaid) {
		String sql = "INSERT INTO quotetion.quotetionFunctionAreaParam (qfaid, girth, area, height, holeLength, holeHeight, windowLength, windowHeight, beamLength, beamHeight) SELECT :tqfaid, girth, area, height, holeLength, holeHeight, windowLength, windowHeight, beamLength, beamHeight FROM quotetion.quotetionFunctionAreaParam WHERE qfaid = :sqfaid";

		return session().createSQLQuery(sql)
				.setLong("tqfaid", tqfaid)
				.setLong("sqfaid", sqfaid)
				.executeUpdate();
	}

}
