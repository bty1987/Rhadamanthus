package com.fanglin.balance.dao.impl;


import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.ComcostDao;
import com.fanglin.balance.po.ComcostPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("comcostDao")
public class ComcostDaoImpl extends DaoImpl<ComcostPO> implements ComcostDao {

	public ComcostDaoImpl() {
		super(ComcostPO.class);
	}
	
	                                            
	@Override
	public List<ComcostPO> pageComcost(Paging paging, List<Filter> filters) {
		PagingQuery<ComcostPO> query = pagingQuery(paging, ComcostPO.class);

		query.desc("cid");
		
		return query.list();
	}


	@Override
	@SuppressWarnings("unchecked")
	public List<ComcostPO> queryComcost(long ident, short type) {
		return session().createCriteria(ComcostPO.class).createAlias("creater", "creater").add(Restrictions.eq("ident",ident)).add(Restrictions.eq("type",type)).list();
	}
   
	
	
}
