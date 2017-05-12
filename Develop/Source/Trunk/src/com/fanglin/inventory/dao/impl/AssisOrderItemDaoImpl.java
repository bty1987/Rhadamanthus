package com.fanglin.inventory.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AssisOrderItemDao;
import com.fanglin.inventory.po.AssisOrderItemPO;

@Repository("assisOrderItemDao")
public class AssisOrderItemDaoImpl extends DaoImpl<AssisOrderItemPO> implements AssisOrderItemDao{
	
	public AssisOrderItemDaoImpl(){
		super(AssisOrderItemPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AssisOrderItemPO> queryAssisOrderItemByAoid(long aoid) {
		return session().createCriteria(AssisOrderItemPO.class).add(Restrictions.eq(AssisOrderItemPO.COLUMN_AOID_STR, aoid)).list();
	}

	@Override
	public List<AssisOrderItemPO> queryAssisOrderItemByAoids(List<Long> aoids) {
		
		List<AssisOrderItemPO> assisOrderItemPOs = new ArrayList<AssisOrderItemPO>();
		
		for(Long aoid : aoids){
			assisOrderItemPOs.addAll(queryAssisOrderItemByAoid(aoid));
		}
		
		return assisOrderItemPOs;
	}

}
