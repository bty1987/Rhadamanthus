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

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Order;
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
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaId(long functionAreaId){
		return createCriteria(QuotationFunctionAreaItemPO.class)
				.add(Restrictions.eq("quotationFunctionArea.qfaId", functionAreaId))
				.addOrder(Order.asc("qfaiId"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds){
		
		if(functionAreaIds.size() == 0){
			return new ArrayList<QuotationFunctionAreaItemPO>();
		}else{
			return session().createCriteria(QuotationFunctionAreaItemPO.class)
					.add(Restrictions.in("quotationFunctionArea.qfaId", functionAreaIds))
					.list();
		}
	}

	@Override
	public QuotationFunctionAreaItemPO queryQuotationFunctionAreaItemByQuotationIdAType(long qId, short type) {
		return (QuotationFunctionAreaItemPO) session().createCriteria(QuotationFunctionAreaItemPO.class).createAlias("quotationFunctionArea", "quotationFunctionArea").createAlias("quotationFunctionArea.quotation", "quotation").add(Restrictions.eq("quotation.qid", qId)).add(Restrictions.eq("type", type)).uniqueResult();
	}

	@Override
	public int updateQuotationFunctionAreaItemForNum(long qfaiId, float num) {
		
		String hql = "update QuotationFunctionAreaItemPO set num= :num where qfaiId =:qfaiId";
		int updateEntities = session().createQuery(hql).setFloat("num", num).setLong("qfaiId", qfaiId).executeUpdate();
		
		return updateEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByFunctionAreaId(long functionAreaId){
		String hql = "delete QuotationFunctionAreaItemPO q where q.quotationFunctionArea.qfaId = :quotationFunctionAreaId";
		int deletedEntities = session().createQuery(hql).setLong("quotationFunctionAreaId", functionAreaId).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds){
		
		if(functionAreaIds.size() == 0){
			return -1;
		}
		
		String hql = "delete QuotationFunctionAreaItemPO q where q.quotationFunctionArea.qfaId in :functionAreaIds";
		int deletedEntities = session().createQuery(hql).setParameterList("functionAreaIds", functionAreaIds).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByQfaiIds(List<Long> qfaiIds) {
		
		String hql = "delete QuotationFunctionAreaItemPO q where q.qfaiId in :qfaiIds";
		int deletedEntities = session().createQuery(hql).setParameterList("qfaiIds", qfaiIds).executeUpdate();
		
		return deletedEntities;
	}
	
}
