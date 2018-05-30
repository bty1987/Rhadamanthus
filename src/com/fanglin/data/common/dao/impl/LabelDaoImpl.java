package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.LabelDao;
import com.fanglin.data.po.LabelPO;
import com.fanglin.utils.Paging;

@Repository("labelDao")
public class LabelDaoImpl extends DaoImpl<LabelPO> implements LabelDao {

	public LabelDaoImpl(){
		super(LabelPO.class);
	}

	@Override
	public List<LabelPO> pageLabel(Paging paging, List<Filter> filters) {
		
		PagingQuery<LabelPO> query = pagingQuery(paging, LabelPO.class);
		
		if(filters != null){
			for(Filter filter : filters){
				
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
	public List<LabelPO> querylabel(Short status) {
		
		Criteria c = session().createCriteria(LabelPO.class);
		if(status != null){
			c.add(Restrictions.eq(LabelPO.COLUMN_STATUS_STR, status));
		}
		
		return c.list();
	}

	
	@Override
	@SuppressWarnings("unchecked")
	public List<LabelPO> querylabelBytype(Short type) {
		
		return session().createCriteria(LabelPO.class).add(Restrictions.eq("type", type)).add(Restrictions.eq(LabelPO.COLUMN_STATUS_STR,LabelPO.STATUS_ENABLE_STR)).list();
	}
	
	
                                   
}
