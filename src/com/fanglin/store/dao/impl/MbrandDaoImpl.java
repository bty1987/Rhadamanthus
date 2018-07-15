package com.fanglin.store.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MbrandDao;
import com.fanglin.store.po.MbrandPO;
import com.fanglin.utils.Paging;

@Repository("mbrandDao")
public class MbrandDaoImpl extends DaoImpl<MbrandPO> implements MbrandDao {
	
	public MbrandDaoImpl() {
		super(MbrandPO.class);
	}

	@Override
	public List<MbrandPO> pageMbrand(Paging paging, List<Filter> filters) {
		
		PagingQuery<MbrandPO> query = pagingQuery(paging, MbrandPO.class);
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				if(field.equals(MbrandPO.COLUMN_NAME_STR)){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals(MbrandPO.COLUMN_NAME_STR)){
					query.alias("mcategory", "mcategory");
					query.add(query.getCriterion(field, Long.valueOf(data), op));
				}
			}
		}
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MbrandPO> queryMbrand(Long cid) {
		
		return session().createCriteria(MbrandPO.class).createAlias("mcategory", "mcategory").add(Restrictions.eq(MbrandPO.COLUMN_CID_STR, cid)).add(Restrictions.eq("status", MbrandPO.STATUS_ABLE_SHORT)).addOrder(Order.asc("mcategory.cid")).list();
		
	}

	@Override
	public List<MbrandPO> queryMbrandByName(Paging paging, String name) {
		
		PagingQuery<MbrandPO> query = pagingQuery(paging, MbrandPO.class);
		
		if(StringUtils.isNotEmpty(name)){
		    query.add(Restrictions.like("name", name, MatchMode.START)).add(Restrictions.eq("status", MbrandPO.STATUS_ABLE_SHORT));
		}
		 
		return query.list();
	}

}
