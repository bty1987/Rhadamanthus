package com.fanglin.system.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

@Repository("roleDao")
public class RoleDaoImpl extends DaoImpl<RolePO> implements RoleDao {
	
	public RoleDaoImpl(){
		super(RolePO.class);
	}

	@Override
	public List<RolePO> pageRole(Paging paging, List<Filter> filters){
		
		PagingQuery<RolePO> query = pagingQuery(paging, RolePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RolePO> queryRole(){
		return session().createCriteria(RolePO.class).list();
	}
	
	@Override
	public RolePO queryRoleByRoleName(String roleName){
		return (RolePO) session().createCriteria(RolePO.class).add(Restrictions.eq("roleName", roleName)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("roleName".equals(field)){
					query.add(query.getCriterion("roleName", data, op));
				}
			}
		}
	}
	
}
