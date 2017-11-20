/**
 * Title: DepartmentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.po.DepartmentTypePO;
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
    @SuppressWarnings({ "unchecked", "deprecation" })
    public List<DepartmentPO> queryDepartment(int type, Integer company){
        Criteria criteria = session().createCriteria(DepartmentPO.class);
        
        criteria.add(Restrictions.eq(DepartmentPO.COLUMN_STATUS_STR, DepartmentPO.STATUS_ENABLE_INT));
        
        if(type != 0){
            criteria = criteria.add(Restrictions.sqlRestriction("type = ? ", String.valueOf(type), Hibernate.STRING));
        }
        
        if(company != null){
        	criteria = criteria.add(Restrictions.eq("company", company));
        }
        
        criteria.addOrder(Order.asc("deptId"));
        
        return criteria.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<String> queryDepartmentForChildren(String fatherDeptId){
    	
        String sql = "select deptId from communion.department where fatherDeptId = '" + fatherDeptId + "' and status = 1";
        Query query = session().createSQLQuery(sql);
        
        return query.list();
    }
    
    private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
    	if(filters != null){
    		query.alias("type", "type");
            for(Filter filter: filters){
                if("deptType".equals(filter.getField())){
                	  query.add(query.getCriterion("type.dtid", Integer.valueOf(filter.getData()),filter.getOp()));
                }else if("deptName".equals(filter.getField())){
                    query.add(query.getCriterion("deptName", filter));
                }else if("company".equals(filter.getField())){
                	query.add(query.getCriterion("company", Integer.valueOf(filter.getData()), filter.getOp()));
                }else if("type".equals(filter.getField())){
                	
                	query.add(query.getCriterion("type.dtid", Integer.valueOf(filter.getData()), filter.getOp()));
                }
            }
        }
    }
    
	@Override
	@SuppressWarnings("unchecked")
	public List<DepartmentTypePO> queryDepartmentType() {		
		
		return session().createCriteria(DepartmentTypePO.class).list();
				
	}

	@Override
	@SuppressWarnings({ "unchecked", "deprecation" })
	public List<DepartmentPO> queryDepartmentBytype(String type , Integer company) {
		
		 return session().createCriteria(DepartmentPO.class).add(Restrictions.sqlRestriction("type = ? ", String.valueOf(type), Hibernate.STRING)).add(Restrictions.eq("company", company)).list();
		
	}
	
	@Override
   public DepartmentTypePO queryTypeNamebydtid(Integer dtid){
	  
	  return (DepartmentTypePO)session().createCriteria(DepartmentTypePO.class).add(Restrictions.eq("dtid",dtid)).uniqueResult();
		
   }
	 @Override
	  public DepartmentPO queryDepartmentByDeptId(String deptId){
		 
	     return (DepartmentPO) createCriteria(DepartmentPO.class).add(Restrictions.eq("deptId",deptId)).uniqueResult();
	  }
	
	
	
	
}
