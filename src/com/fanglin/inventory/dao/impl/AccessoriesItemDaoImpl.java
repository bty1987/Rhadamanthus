package com.fanglin.inventory.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;

@Repository("accessoriesItemDao")
public class AccessoriesItemDaoImpl extends DaoImpl<AccessoriesItemPO> implements AccessoriesItemDao{
	
	public AccessoriesItemDaoImpl(){
		super(AccessoriesItemPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<AccessoriesItemPO> queryAccessoriesItemByAid(long aid) {
		return session().createCriteria(AccessoriesItemPO.class).add(Restrictions.eq(AccessoriesItemPO.COLUMN_AOID_STR, aid)).list();
	}

	@Override
	public List<AccessoriesItemPO> queryAccessoriesItemByAids(List<Long> aids) {
		
		List<AccessoriesItemPO> accessoriesItemPOs = new ArrayList<AccessoriesItemPO>();
		
		for(Long aid : aids){
			accessoriesItemPOs.addAll(queryAccessoriesItemByAid(aid));
		}
		
		return accessoriesItemPOs;
	}

}
