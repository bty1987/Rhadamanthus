package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.RuotationItemDao;
import com.fanglin.quotation.po.RuotationItemPO;

@Repository("ruotationItemDao")
public class RuotationItemDaoImpl extends DaoImpl<RuotationItemPO> implements RuotationItemDao{

	public RuotationItemDaoImpl() {
		super(RuotationItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RuotationItemPO> queryRuotationItem(long qrid, long qfaId) {

		return session().createCriteria(RuotationItemPO.class).createAlias("ruotation", "ruotation").createAlias("quotationFunctionArea", "quotationFunctionArea").add(Restrictions.eq("ruotation.qrid", qrid)).add(Restrictions.eq("quotationFunctionArea.qfaId", qfaId)).list();
	}

	@Override
	public long updateRuotationItemForIndex(long qriid, int index) {

		String sql = "update RuotationItemPO set index = :index where qriid = :qriid";
		session().createQuery(sql).setInteger("index", index).setLong("qriid", qriid).executeUpdate();

		return 0;
	}

}
