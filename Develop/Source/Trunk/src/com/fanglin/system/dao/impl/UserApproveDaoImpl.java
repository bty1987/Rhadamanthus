/**
 * Title: UserApproveDaoImpl
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: YunFeng Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.po.UserApprovePO;
import com.fanglin.system.dao.UserApproveDao;
import com.fanglin.utils.Paging;

@Repository("userApproveDaoImpl")
public class UserApproveDaoImpl extends DaoImpl<UserApprovePO> implements UserApproveDao{

    public UserApproveDaoImpl(){
        super(UserApprovePO.class);
    }

    @Override
    public List<UserApprovePO> pageUserApprove(Paging paging, List<FilterVO> filters){

        PagingQuery<UserApprovePO> query = pagingQuery(paging, UserApprovePO.class);

        if(filters != null){
            query.alias("user", "user");
            
            for(FilterVO filter : filters){
                if("userId".equals(filter.getField())){
                    query.add(query.getCriterion("user.userId", filter));
                } else if("userName".equals(filter.getField())){
                    query.add(query.getCriterion("user.currentName", filter));
                } else if("type".equals(filter.getField())){
                    query.add(query.getCriterion("type", filter));
                }
            }
        }
        return query.list();
    }
    
    @Override
    public List<UserApprovePO> queryApproveUserForNameByType(Paging paging, String pinyinName, String type){
    	PagingQuery<UserApprovePO> query = pagingQuery(paging, UserApprovePO.class);
    	
		query.alias("user", "user");
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.ilike("user.userName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("user.userNamePinYin", pinyinName, MatchMode.ANYWHERE)));
		}
		
		query.add(Restrictions.eq("type", type));
		
		return query.list();
    }
    
	@Override
	@SuppressWarnings("unchecked")
    public List<UserApprovePO> queryApproveUserByUserId(String userId){
    	return session().createCriteria(UserApprovePO.class)
    			.createAlias("user", "user")
    			.add(Restrictions.eq("user.userId", userId))
    			.list();
    }
}
