package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.McategoryDao;
import com.fanglin.store.po.McategoryPO;
import com.fanglin.utils.Paging;

@Repository("mcategoryDao")
public class McategoryDaoImpl extends DaoImpl<McategoryPO> implements McategoryDao {

	public McategoryDaoImpl() {
		super(McategoryPO.class);
	}
	
	@Override
	public List<McategoryPO> pageMcategory(Paging paging, List<Filter> filters) {
		
		PagingQuery<McategoryPO> query = pagingQuery(paging, McategoryPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("name")){
					query.add(query.getCriterion(field, data, op));
				}
			}
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<McategoryPO> queryMcategory() {
		return session().createCriteria(McategoryPO.class).addOrder(Order.desc("isShow")).addOrder(Order.asc("cid")).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<McategoryPO> queryMcategoryForShow() {
		return session().createCriteria(McategoryPO.class).add(Restrictions.eq("isShow", McategoryPO.SHOW_INIT_SHORT)).list();
	}

}
