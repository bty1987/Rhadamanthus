/**
 * @FileName	: OrganizationDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.OrganizationDao;
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.system.vo.OrganizationVO;
import com.fanglin.utils.Paging;

@Repository("organizationDao")
public class OrganizationDaoImpl extends DaoImpl<OrganizationPO> implements OrganizationDao {

	public OrganizationDaoImpl(){
		super(OrganizationPO.class);
	}
	
	@Override
	public List<OrganizationPO> pageOrganization(Paging paging, List<Filter> filters){

		PagingQuery<OrganizationPO> query = pagingQuery(paging, OrganizationPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OrganizationPO> queryOrganization(OrganizationVO organizationVO, Integer company) {
		return session().createCriteria(OrganizationPO.class).add(Restrictions.eq("company", company)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters == null) return;
		
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if(OrganizationPO.COLUMN_NAME_STR.equals(field)){
				query.add(query.getCriterion(field, data, op));
			}else if(OrganizationPO.COLUMN_STATUS_STR.equals(field)){
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

	
	
}
