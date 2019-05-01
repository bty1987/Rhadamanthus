/**
 * @File Name		: VactivityDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.VactivityDao;
import com.fanglin.information.po.VactivityPO;
import com.fanglin.utils.Paging;

@Repository("vactivityDao")
public class VactivityDaoImpl extends DaoImpl<VactivityPO> implements VactivityDao {
	
	public VactivityDaoImpl(){
		super(VactivityPO.class);
	}
	
	@Override
	public List<VactivityPO> pageVactivity(Paging paging, List<Filter> filters) {

		PagingQuery<VactivityPO> query = pagingQuery(paging, VactivityPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<VactivityPO> queryVactivity() {
		return session().createCriteria(VactivityPO.class).add(Restrictions.eq("status", VactivityPO.STATUS_INIT_INT)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("name")){
					query.add(query.getCriterion(field, data, op));
				}else if(field.equals("status")){
					query.add(query.getCriterion(field, data, op));
				}
			}
		}
		
	}

}
