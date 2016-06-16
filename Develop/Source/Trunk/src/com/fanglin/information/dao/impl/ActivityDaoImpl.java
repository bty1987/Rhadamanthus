/**
 * @File Name		: ActivityDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.utils.Paging;

@Repository("activityDao")
public class ActivityDaoImpl extends DaoImpl<ActivityPO> implements ActivityDao {
	
	public ActivityDaoImpl(){
		super(ActivityPO.class);
	}

	@Override
	public List<ActivityPO> pageActivity(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<ActivityPO> query = pagingQuery(paging, ActivityPO.class);
		
		if(filters != null){
			for(FilterVO filterVO: filters){
				
				if(ActivityPO.COLUMN_STATUS_STR.equals(filterVO.getField())){
					query.add(query.getCriterion(filterVO.getField(), Short.valueOf(filterVO.getData()), filterVO.getOp()));
				}else{
					query.add(query.getCriterion(filterVO.getField(), filterVO.getData(), filterVO.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityPO> queryActivityForValid() {
		return session().createCriteria(ActivityPO.class).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).list();
	}
	
}
