/**
 * @File Name		: QuotationFunctionAreaItemDaoImpl
 * @Package   	: com.fanglin.dao.impl.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
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
				.createAlias("quotationItem", "quotationItem")
				.add(Restrictions.eq("quotationFunctionArea.autoId", functionAreaId))
				.addOrder(Order.asc("quotationItem.itemId"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionAreaItemPO> queryQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds){
		
		if(functionAreaIds.size() == 0){
			return new ArrayList<QuotationFunctionAreaItemPO>();
		}else{
			return session().createCriteria(QuotationFunctionAreaItemPO.class)
					.add(Restrictions.in("quotationFunctionArea.autoId", functionAreaIds))
					.list();
		}
	}

	@Override
	public int updateQuotationFunctionAreaItemForNum(long qfaiId, float num) {
		
		String hql = "update QuotationFunctionAreaItemPO set num= :num where qfaiId =:qfaiId";
		int updateEntities = session().createQuery(hql).setFloat("num", num).setLong("qfaiId", qfaiId).executeUpdate();
		
		return updateEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByFunctionAreaId(long functionAreaId){
		String hql = "delete QuotationFunctionAreaItemPO q where q.quotationFunctionArea.autoId = :quotationFunctionAreaAutoId";
		int deletedEntities = session().createQuery(hql).setLong("quotationFunctionAreaAutoId", functionAreaId).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByFunctionAreaIds(List<Long> functionAreaIds){
		
		if(functionAreaIds.size() == 0){
			return -1;
		}
		
		String hql = "delete QuotationFunctionAreaItemPO q where q.quotationFunctionArea.autoId in :functionAreaIds";
		int deletedEntities = session().createQuery(hql).setParameterList("functionAreaIds", functionAreaIds).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteQuotationFunctionAreaItemByUuids(List<String> uuids){
		
		if(uuids.size() == 0){
			return -1;
		}
		
		String hql = "delete QuotationFunctionAreaItemPO q where q.uuid in :uuids";
		int deletedEntities = session().createQuery(hql).setParameterList("uuids", uuids).executeUpdate();
		
		return deletedEntities;
	}
}
