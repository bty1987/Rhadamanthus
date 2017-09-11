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

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.utils.Paging;

@Repository("addReduceItemDao")
public class AddReduceItemDaoImpl extends DaoImpl<AddReduceItemPO> implements AddReduceItemDao {
	
	public AddReduceItemDaoImpl(){
		super(AddReduceItemPO.class);
	}
	
	@Override
	public List<AddReduceItemPO> pageAddReduceItem(Paging paging, List<Filter> filters) {
		
		PagingQuery<AddReduceItemPO> query = pagingQuery(paging, AddReduceItemPO.class);
		
		return query.list();
	}

	@Override
	public List<AddReduceItemPO> pageAddReduceItemByAddReduceId(Paging paging, List<Filter> filters, int arId) {
		
		PagingQuery<AddReduceItemPO> query = pagingQuery(paging, AddReduceItemPO.class);
		
		query.add(Restrictions.eq(AddReduceItemPO.COLUMN_ARID_STR, arId));
		
		return query.list();
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
	public int deleteAddReductItemByAddReduceId(int addReduceId) {
		
		String sqlUpdate = "delete from quotation.addreduceitem where arId = :arId";
		int deletedEntities = session().createSQLQuery( sqlUpdate ).setInteger("arId", addReduceId ).executeUpdate();
		
		return deletedEntities;
	}

}
