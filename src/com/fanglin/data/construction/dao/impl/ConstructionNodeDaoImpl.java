package com.fanglin.data.construction.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.construction.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodeCompanyPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.Paging;

@Repository("constructionNodeDao")
public class ConstructionNodeDaoImpl extends DaoImpl<ConstructionNodePO> implements ConstructionNodeDao {
	
	public ConstructionNodeDaoImpl() {
		super(ConstructionNodePO.class);
	}

	@Override
	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters) {
		
		PagingQuery<ConstructionNodePO> query = pagingQuery(paging, ConstructionNodePO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String op = filter.getOp();
				String data = filter.getData();
				
				if(field.equals("name")){
					query.add(query.getCriterion("name", data, op));
				}
				
			}
		}
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionNodePO> queryConstructionNode(Short status) {
		
		Criteria c = session().createCriteria(ConstructionNodePO.class);
		if(status != null){
			c.add(Restrictions.eq(ConstructionNodePO.COLUMN_STATUS_STR, status));
		}
		return c.list();
		
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionNodeCompanyPO> queryConstructionNodeCompanyByCid(Integer cid) {
		return session().createCriteria(ConstructionNodeCompanyPO.class).add(Restrictions.eq(ConstructionNodeCompanyPO.COLUMN_CID_STR, cid)).list();
	}

}