/**
 * Title: NoticeDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.dao.NoticeDao;
import com.fanglin.information.po.NoticePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("noticeDao")
public class NoticeDaoImpl extends DaoImpl<NoticePO> implements NoticeDao {

	public NoticeDaoImpl(){
		super(NoticePO.class);
	}

	@Override
	public List<NoticePO> queryPageNotices(Paging paging, List<FilterVO> filters, String userId){

		PagingQuery<NoticePO> query = pagingQuery(paging, NoticePO.class);
		
		query.alias("user", "user");
		query.add(Restrictions.eq("user.userId", userId));
		
		if(filters != null){
			for(FilterVO filter : filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("deptId".equals(filter.getField())){
						query.alias("dept", "dept");
						query.add(query.getCriterion("dept.deptId", filter));
					}else if("dateRange".equals(filter.getField())){
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
						query.add(query.getCriterion("startTime", eTime, "le"));
						query.add(query.getCriterion("endTime", sTime, "ge"));
					} else if("theme".equals(filter.getField())){
						query.add(query.getCriterion("theme", filter));
					}
				}
			}
		}
		
		query.desc("publishTime");
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<NoticePO> queryValidNotices(String type){
		return session().createCriteria(NoticePO.class)
				.add(Restrictions.eq("type", type))
				.add(Restrictions.le("startTime", DateUtil.current("yyyy-MM-dd")))
				.add(Restrictions.ge("endTime", DateUtil.current("yyyy-MM-dd")))
				.list(); 
	}
	
	@Override
	public List<NoticePO> queryPageDeptValidNotices(Paging paging, List<String> deptIds, String type){
	    PagingQuery<NoticePO> query = pagingQuery(paging, NoticePO.class);
	    
	    query.alias("dept", "dept");
	    
	    query.add(Restrictions.eq("type", type));
	    
	    if(deptIds.size() != 0){
	    	query.add(Restrictions.or(Restrictions.in("dept.deptId", deptIds), Restrictions.eq("isPublic", "是")));
	    }else{
	    	query.add(Restrictions.eq("isPublic", "是"));
	    }
	    
	    query.add(Restrictions.le("startTime", DateUtil.current("yyyy-MM-dd")));
        query.add(Restrictions.ge("endTime", DateUtil.current("yyyy-MM-dd")));
	    
	    query.desc("publishTime");
	    
	    return query.list();
	}
}
