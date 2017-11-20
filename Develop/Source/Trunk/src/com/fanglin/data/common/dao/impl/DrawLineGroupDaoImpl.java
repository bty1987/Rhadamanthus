package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.utils.Paging;

@Repository("drawLineGroupDao")
public class DrawLineGroupDaoImpl extends DaoImpl<DrawLineGroupPO> implements DrawLineGroupDao{

	public DrawLineGroupDaoImpl(){
		super(DrawLineGroupPO.class);
	}
	
	public List<DrawLineGroupPO> pageDrawLineGroup(Paging paging, List<Filter> filters,int company){
		
		PagingQuery<DrawLineGroupPO> query = pagingQuery(paging, DrawLineGroupPO.class);
		query.add(Restrictions.eq("company", company));
		queryFilterExcute(query, filters);
		
		return query.list();
		
	}

	@Override
	public DrawLineGroupPO queryDrawLineGroupByName(String groupName, int company) {
		return (DrawLineGroupPO)createCriteria(DrawLineGroupPO.class).add(Restrictions.eq(DrawLineGroupPO.COLUMN_NAME_STR , groupName)).add(Restrictions.eq("company", company)).uniqueResult();
	}
	
	@Override
	public DrawLineGroupPO queryDrawLineGroupById(long gid) {
		return (DrawLineGroupPO) createCriteria(DrawLineGroupPO.class).add(Restrictions.eq(DrawLineGroupPO.COLUMN_GID_STR  , gid)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLineGroupPO> queryDrawLineGroup(int company) {
		return (List<DrawLineGroupPO>)createCriteria(DrawLineGroupPO.class).add(Restrictions.eq("status", DrawLineGroupPO.STATUS_ENABLE_INT)).add(Restrictions.eq("company",company)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query,List<Filter> filters) {
		
		if(filters != null){
			
			for(Filter filter: filters){
				
				if(StringUtils.isNotEmpty(filter.getData())){	
					
					if("name".equals(filter.getField())){
						query.add(query.getCriterion("name",(filter.getData()), filter.getOp()));
					}	
					
				}				
			}				
		}	
	}

}
