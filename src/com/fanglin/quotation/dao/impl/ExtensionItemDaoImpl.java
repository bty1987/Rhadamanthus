package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Repository("extensionItemDao")
public class ExtensionItemDaoImpl extends DaoImpl<ExtensionItemPO> implements ExtensionItemDao {

	public ExtensionItemDaoImpl() {
		super(ExtensionItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionItemPO> queryExtensionItem(Long eId) {
		return session().createCriteria(ExtensionItemPO.class).add(Restrictions.eq(ExtensionItemPO.COLUMN_EID_STR, eId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionItemPO> queryExtensionItem(List<Long> extensionItemIDs) {
		return session().createCriteria(ExtensionItemPO.class).add(Restrictions.in(ExtensionItemPO.COLUMN_EID_STR, extensionItemIDs)).list();
	}

	@Override
	public long countExtensionItem(long qfaid) {

		String sql = "select count(*) from quotation.extensionitem where quotationFunctionAreaId =:qfaid";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("qfaid", qfaid).uniqueResult();

		return count.longValue();
	}

	@Override
	public long countExtensionItem(List<QuotationFunctionAreaPO> quotationFunctionAreas) {
		return (Long) createCriteria(ExtensionItemPO.class).add(Restrictions.in("quotationFunctionArea", quotationFunctionAreas)).setProjection(Projections.rowCount()).uniqueResult();
	}

	@Override
	public int deleteExtensionItem(long eid) {

		String sql = "delete from quotation.extensionItem where eid = :eid";
		session().createSQLQuery(sql).setLong("eid", eid).executeUpdate();

		return 0;
	}

}
