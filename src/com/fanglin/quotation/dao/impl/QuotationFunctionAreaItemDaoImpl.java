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
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;


@Repository("quotationFunctionAreaItemDao")
public class QuotationFunctionAreaItemDaoImpl extends DaoImpl<QuotationFunctionAreaItemPO> implements QuotationFunctionAreaItemDao{
	
	public QuotationFunctionAreaItemDaoImpl(){
		super(QuotationFunctionAreaItemPO.class);
	}

	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQfaiId(Class<?> clazz, long qfaiId) {
		return (QuotationFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("qfaiId", qfaiId)).uniqueResult();
	}
	
	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(Class<?> clazz,Long quotationFunctionAreaId, Short type) {
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
	public int deleteQuotationFunctionAreaItemByFunctionAreaId(String table,  long functionAreaId) {
		String hql = String.format("delete %s  q where q.quotationFunctionArea.qfaId = :quotationFunctionAreaId",table);
		int deletedEntities = session().createQuery(hql).setLong("quotationFunctionAreaId", functionAreaId).executeUpdate();
		
		return deletedEntities;
	}
	
	@Override
	public int deleteQuotationFunctionAreaItemByQfaiIds(String table, List<Long> qfaiIds) {
		String hql = String.format("delete %s q where q.qfaiId in :qfaiIds",table);
		int deletedEntities = session().createQuery(hql).setParameterList("qfaiIds", qfaiIds).executeUpdate();
		
		return deletedEntities;
	}


}
