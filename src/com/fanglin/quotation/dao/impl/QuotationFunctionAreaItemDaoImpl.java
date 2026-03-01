/**
 * @File Name		: QuotationFunctionAreaItemDaoImpl
 * @Package   	: com.fanglin.dao.impl.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;

@Repository("quotationFunctionAreaItemDao")
public class QuotationFunctionAreaItemDaoImpl extends DaoImpl<QuotationFunctionAreaItemPO> implements QuotationFunctionAreaItemDao {

	public QuotationFunctionAreaItemDaoImpl() {
		super(QuotationFunctionAreaItemPO.class);
	}

	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQfaiId(Class<?> clazz, long qfaiId) {
		return (QuotationFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("qfaiId", qfaiId)).uniqueResult();
	}

	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(Class<?> clazz, Long quotationFunctionAreaId, Short type) {
		return (QuotationFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("quotationFunctionArea.qfaId", quotationFunctionAreaId)).add(Restrictions.eq("type", type)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaId(Class<?> clazz, long functionAreaId) {
		return session().createCriteria(clazz).createAlias("quotationFunctionArea", "quotationFunctionArea").add(Restrictions.eq("quotationFunctionArea.qfaId", functionAreaId)).list();
	}

	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQuotationIdAType(Class<?> clazz, long qId, short type) {
		return (QuotationFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("type", type)).createAlias("quotationFunctionArea", "quotationFunctionArea").add(Restrictions.eq("quotationFunctionArea.qfaId", qId)).uniqueResult();
	}

	@Override
	public int updateQuotationFunctionAreaItemForIndex(String table, long qfaiid, int index) throws FLException {

		String sql = String.format("update %s  set index = :index where qfaiid = :qfaiid", table);
		session().createQuery(sql).setLong("qfaiid", qfaiid).setInteger("index", index).executeUpdate();

		return 0;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByFunctionAreaId(String table, long functionAreaId) {

		String sql = String.format("delete %s  q where q.quotationFunctionArea.qfaId = :quotationFunctionAreaId", table);
		int deletedEntities = session().createQuery(sql).setLong("quotationFunctionAreaId", functionAreaId).executeUpdate();

		return deletedEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByQfaiIds(String table, List<Long> qfaiIds) {

		String sql = String.format("delete %s q where q.qfaiId in :qfaiIds", table);
		int deletedEntities = session().createQuery(sql).setParameterList("qfaiIds", qfaiIds).executeUpdate();

		return deletedEntities;
	}

	@Override
	public int copyQuotationFunctionAreaItem(String table, long sqfaid, long tqfaid) {

		String sql = String.format("INSERT INTO quotation.%s (qfaid, itemName, measurementUnit, workType, addPrice, unitPrice, subPrice, formula, initNum, num, type, subtype, discount, content, `index`) SELECT :tqfaid, itemName, measurementUnit, workType, addPrice, unitPrice, subPrice, formula, initNum, num, type, subtype, discount, content, `index` FROM quotation.%s WHERE qfaid = :sqfaid", table, table);

		return session().createSQLQuery(sql).setLong("tqfaid", tqfaid).setLong("sqfaid", sqfaid).executeUpdate();
	}

}
