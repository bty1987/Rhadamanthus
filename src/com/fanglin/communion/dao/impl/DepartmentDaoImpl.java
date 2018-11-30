/**
 * Title: DepartmentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("departmentDaoImpl")
public class DepartmentDaoImpl extends DaoImpl<DepartmentPO> implements DepartmentDao{

    public DepartmentDaoImpl(){
        super(DepartmentPO.class);
    }

    @Override
    public List<DepartmentPO> pageDepartment(Paging paging, List<Filter> filters,int company){
    	
        PagingQuery<DepartmentPO> query = pagingQuery(paging, DepartmentPO.class);
        query.add(Restrictions.eq("company", company));
        queryFilterExcute(query, filters);

        return query.list();
    }
    
    @Override
	public List<DepartmentPO> pageDepartmentByName(Paging paging, String name, Integer company, int type) {
		
		PagingQuery<DepartmentPO> query = pagingQuery(paging, DepartmentPO.class);
		
		query.add(Restrictions.or(Restrictions.ilike(DepartmentPO.COLUMN_DEPTNAME_STR, name, MatchMode.ANYWHERE), Restrictions.ilike(DepartmentPO.COLUMN_PINYIN_STR, name, MatchMode.ANYWHERE)));
		
		if(company != null){
			query.add(Restrictions.eq(DepartmentPO.COLUMN_COMPANY_STR, company));
        }
		
		if(type != 0){
			query.alias("type", "type");
			query.add(Restrictions.eq(DepartmentPO.COLUMN_TYPE_STR, type));
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
    public List<DepartmentPO> queryDepartment(int type, Integer company){
		
        Criteria criteria = session().createCriteria(DepartmentPO.class);
        
        criteria.add(Restrictions.eq(DepartmentPO.COLUMN_STATUS_STR, DepartmentPO.STATUS_ENABLE_INT));
        
        if(type != 0){
        	criteria.createAlias("type", "type");
            criteria.add(Restrictions.eq("type.dtid", type));
        }
        
        if(company != null){
        	criteria.add(Restrictions.eq("company", company));
        }
        
		criteria.addOrder(Order.asc("did"));
        
        return criteria.list();
    }

	@Override
	public DepartmentPO queryDepartmentByNo(String no) {

		return (DepartmentPO) session().createCriteria(DepartmentPO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentPO> queryDepartmentBytype(int type , Integer company) {
		 return session().createCriteria(DepartmentPO.class).createAlias("type", "type").add(Restrictions.eq("type.dtid", type)).add(Restrictions.eq("company", company)).add(Restrictions.eq(DepartmentPO.COLUMN_STATUS_STR, DepartmentPO.STATUS_ENABLE_INT)).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
    	if(filters != null){
    		query.alias("type", "type");
            for(Filter filter: filters){
                if("deptType".equals(filter.getField())){
                	  query.add(query.getCriterion("type.dtid", Integer.valueOf(filter.getData()),filter.getOp()));
                }else if("deptName".equals(filter.getField())){
					query.add(query.getCriterion("name", filter));
                }else if("company".equals(filter.getField())){
                	query.add(query.getCriterion("company", Integer.valueOf(filter.getData()), filter.getOp()));
                }
            }
        }
    }

	
}
