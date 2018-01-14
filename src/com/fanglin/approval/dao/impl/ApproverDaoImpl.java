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

import com.fanglin.approval.dao.ApproverDao;
import com.fanglin.approval.po.ApproverPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("approverDaoImpl")
public class ApproverDaoImpl extends DaoImpl<ApproverPO> implements ApproverDao{

    public ApproverDaoImpl(){
        super(ApproverPO.class);
    }

    @Override
    public List<ApproverPO> pageApprover(Paging paging, List<Filter> filters,int company){

        PagingQuery<ApproverPO> query = pagingQuery(paging, ApproverPO.class);
        query.alias("user", "user");
        query.add(Restrictions.eq("user.company", company));
        
        queryFilterExcute(query, filters);
      
        return query.list();
    }
    
    
    @Override
    @SuppressWarnings("unchecked")
	public List<ApproverPO> queryApprovalUserByType(short type,int company) {
		
		return session().createCriteria(ApproverPO.class).add(Restrictions.eq(ApproverPO.COLUMN_TYPE_STR, type)).createAlias("user", "user").add(Restrictions.eq("user.company", company)).list();
	}
    
	@Override
	@SuppressWarnings("unchecked")
    public List<ApproverPO> queryApproverByUserId(String userId){
		
    	return session().createCriteria(ApproverPO.class).createAlias("user", "user").add(Restrictions.eq("user.userId", userId)).list();
    
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
        if(filters != null){
            for(Filter filter : filters){
                if("userId".equals(filter.getField())){
                    query.add(query.getCriterion("user.userId", filter));
                } else if("senderName".equals(filter.getField())){
                    query.add(query.getCriterion("user.userId", filter));
                } else if("type".equals(filter.getField())){
                    query.add(query.getCriterion("type", Short.valueOf(filter.getData()), filter.getOp()));
                }  
            }
        }
	}	
}
