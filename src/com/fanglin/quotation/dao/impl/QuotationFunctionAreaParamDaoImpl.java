package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationFunctionAreaParamDao;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;

@Repository("QuotationFunctionAreaParamDao")
public class QuotationFunctionAreaParamDaoImpl extends DaoImpl<QuotationFunctionAreaParamPO> implements QuotationFunctionAreaParamDao {

	public QuotationFunctionAreaParamDaoImpl() {
		super(QuotationFunctionAreaParamPO.class);
	}

	@Override
	public QuotationFunctionAreaParamPO queryQuotationFunctionAreaParam(Long qfaid) {
		return (QuotationFunctionAreaParamPO) session().createCriteria(QuotationFunctionAreaParamPO.class).add(Restrictions.eq(QuotationFunctionAreaParamPO.COLUMN_QFAID_STR, qfaid)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaParamPO> queryQuotationFunctionAreaParamByQfaid(Long qfaid) {
		return createCriteria(QuotationFunctionAreaParamPO.class).add(Restrictions.eq("qfaid", qfaid)).list();
	}

	@Override
	public int copyQuotationFunctionAreaParam(long sqfaid, long tqfaid) {
		String sql = "INSERT INTO quotation.quotationfunctionareaparam (qfaid, girth, area, height, holeLength, holeHeight, windowLength, windowHeight, beamLength, beamHeight) SELECT :tqfaid, girth, area, height, holeLength, holeHeight, windowLength, windowHeight, beamLength, beamHeight FROM quotation.quotationfunctionareaparam WHERE qfaid = :sqfaid";

		return session().createSQLQuery(sql)
				.setLong("tqfaid", tqfaid)
				.setLong("sqfaid", sqfaid)
				.executeUpdate();
	}

}
