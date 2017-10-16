/**
 * Title: UserApproveDaoImpl
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApproveUserDao;
import com.fanglin.approval.po.ApproveUserPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approveUserDaoImpl")
public class ApproveUserDaoImpl extends DaoImpl<ApproveUserPO> implements ApproveUserDao{

    public ApproveUserDaoImpl(){
        super(ApproveUserPO.class);
    }

    @Override
    public List<ApproveUserPO> pageApproveUser(Paging paging, List<Filter> filters,int company){

        PagingQuery<ApproveUserPO> query = pagingQuery(paging, ApproveUserPO.class);
        query.alias("user", "user");
        query.add(Restrictions.eq("user.company", company));
        
        queryFilterExcute(query, filters);
      
        return query.list();
    }
    
    
    @Override
    @SuppressWarnings("unchecked")
	public List<ApproveUserPO> queryApprovalUserByType(short type,int company) {
		
		return session().createCriteria(ApproveUserPO.class).add(Restrictions.eq(ApproveUserPO.COLUMN_TYPE_STR, type)).createAlias("user", "user").add(Restrictions.eq("user.company", company)).list();
	}
    
	@Override
	@SuppressWarnings("unchecked")
    public List<ApproveUserPO> queryApproveUserByUserId(String userId){
		
    	return session().createCriteria(ApproveUserPO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).list();
    
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
        if(filters != null){
            for(Filter filter : filters){
                if("userId".equals(filter.getField())){
                    query.add(query.getCriterion("user.userId", filter));
                } else if("userName".equals(filter.getField())){
                    query.add(query.getCriterion("user.currentName", filter));
                } else if("type".equals(filter.getField())){
                    query.add(query.getCriterion("type", Short.valueOf(filter.getData()), filter.getOp()));
                }  
            }
        }
	}	
}
