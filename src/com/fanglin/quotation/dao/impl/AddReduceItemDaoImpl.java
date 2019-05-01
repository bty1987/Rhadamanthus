/**
 * @File Name		: AddReduceItemDaoImpl.java
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

@Repository("addReduceItemDao")
public class AddReduceItemDaoImpl extends DaoImpl<AddReduceItemPO> implements AddReduceItemDao {
	
	public AddReduceItemDaoImpl(){
		super(AddReduceItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceId(int addReduceId) {
		return session().createCriteria(AddReduceItemPO.class).add(Restrictions.eq(AddReduceItemPO.COLUMN_ARID_STR, addReduceId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds) {
		return session().createCriteria(AddReduceItemPO.class).add(Restrictions.in(AddReduceItemPO.COLUMN_ARID_STR, addReduceIds)).list();
	}

	@Override
	public int countAddReduceItemForFunctionArea(long qfaid) {
		
		String sql = "select count(*) from quotation.addreduceitem where quotationFunctionAreaId =:qfaid";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("qfaid", qfaid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countAddReduceItemForFunctionArea(List<QuotationFunctionAreaPO> quotationFunctionAreas) {
		return (Integer) createCriteria(AddReduceItemPO.class).add(Restrictions.in("quotationFunctionArea", quotationFunctionAreas)).setProjection(Projections.rowCount()).uniqueResult();
	}

}
