/**
 * Title: DepartmentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.department.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.dao.DepartmentDao;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("departmentDaoImpl")
public class DepartmentDaoImpl extends DaoImpl<DepartmentPO> implements DepartmentDao{

    public DepartmentDaoImpl(){
        super(DepartmentPO.class);
    }

    @Override
    public List<DepartmentPO> pageDepartment(Paging paging, List<FilterVO> filters){

        PagingQuery<DepartmentPO> query = pagingQuery(paging, DepartmentPO.class);
        
        queryFilterExcute(query, filters);

        return query.list();
    }

	@Override
    @SuppressWarnings("unchecked")
    public List<DepartmentPO> queryDepartment(String type, Integer company){
        Criteria criteria = session().createCriteria(DepartmentPO.class);
        
        if(!type.equals("all")){
            criteria = criteria.add(Restrictions.eq("type", type));
        }
        
        if(company != null){
        	criteria = criteria.add(Restrictions.eq("company", SystemConfig.getInt("company")));
        }
        
        criteria.addOrder(Order.asc("deptId"));
        
        return criteria.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<String> queryDepartmentForChildren(String fatherDeptId){
    	
        String sql = "select deptId from communion.department where fatherDeptId = '" + fatherDeptId + "'";
        Query query = session().createSQLQuery(sql);
        
        return query.list();
    }
    
    private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
    	if(filters != null){
            for(FilterVO filter: filters){
                if("type".equals(filter.getField())){
                    query.add(query.getCriterion("type", filter));
                }else if("deptName".equals(filter.getField())){
                    query.add(query.getCriterion("deptName", filter));
                }else if("company".equals(filter.getField())){
                	query.add(query.getCriterion("company", Integer.valueOf(filter.getData()), filter.getOp()));
                }
            }
        }
    }
}
