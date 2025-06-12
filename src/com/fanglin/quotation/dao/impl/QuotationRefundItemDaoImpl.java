package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationRefundItemDao;
import com.fanglin.quotation.po.QuotationRefundItemPO;

@Repository("quotationRefundItemDao")
public class QuotationRefundItemDaoImpl extends DaoImpl<QuotationRefundItemPO> implements QuotationRefundItemDao{

	public QuotationRefundItemDaoImpl() {
		super(QuotationRefundItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationRefundItemPO> queryQuotationRefundItem(long qrid, long qfaId) {

		return session().createCriteria(QuotationRefundItemPO.class).add(Restrictions.eq("quotationRefund.qrid", qrid)).add(Restrictions.eq("quotationFunctionArea.qfaId", qfaId)).list();
	}

	@Override
	public long updateQuotationRefundItemForIndex(long qriid, int index) {

		String sql = "update QuotationRefundItemPO set index = :index where qriid = :qriid";
		session().createQuery(sql).setInteger("index", index).setLong("qriid", qriid).executeUpdate();

		return 0;
	}

}
