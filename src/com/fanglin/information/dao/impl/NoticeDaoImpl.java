/**
 * Title: NoticeDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
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
	public List<NoticePO> pageNotice(Paging paging, List<Filter> filters, String userId, Integer company){
		
		PagingQuery<NoticePO> query = pagingQuery(paging, NoticePO.class);
		
		query.add(Restrictions.eq("company", company));
		
		queryFilterExcute(query, filters);
		
		query.desc("publishTime");
		
		return query.list();
	}
	
	@Override
	public List<NoticePO> pageNoticeForSeenByType(Paging paging, List<Filter> filters, List<Long> nids, Short type, Integer company){

		PagingQuery<NoticePO> query = pagingQuery(paging, NoticePO.class);
		
		query.add(Restrictions.eq("company", company));
		
		if(nids != null && nids.size() != 0){
			query.add(Restrictions.or(Restrictions.in("nid", nids), Restrictions.eq("isPublic", NoticePO.ISPUBLIC_PUBLIC_INT)));
		}else{
			query.add(Restrictions.eq("isPublic", NoticePO.ISPUBLIC_PUBLIC_INT));
		}
		
		query.add(Restrictions.eq("type", type));
		query.add(Restrictions.le("startTime", DateUtil.current("yyyy-MM-dd")));
		query.add(Restrictions.ge("endTime", DateUtil.current("yyyy-MM-dd")));
		
		queryFilterExcute(query, filters);
		
		query.desc("publishTime");
		
	    return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			for(Filter filter: filters){
			
				if("dateRange".equals(filter.getField())){
					
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
	
}
