/**
 * Title: NoticeDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
	//多条件分页
	@Override
	public List<NoticePO> queryPageNotices(Paging paging, List<Filter> filters, String userId){
		//
		PagingQuery<NoticePO> query = pagingQuery(paging, NoticePO.class);
		//重命名
		query.alias("user", "user");
		//user.userId =(equals) userId,
		query.add(Restrictions.eq("user.userId", userId));
		
		//如果filters不等于空
		if(filters != null){
			//将集合的值循环赋给 filter对象
			for(Filter filter : filters){
				//如果filter.getDate不为空
				if(StringUtils.isNotEmpty(filter.getData())){
					//如果deptId相等于filter.getField
					if("deptId".equals(filter.getField())){
					//将dept重命名
						query.alias("dept", "dept");
						//查询条件
						query.add(query.getCriterion("dept.deptId", filter));
						//如果相等filter集合中的field
					}else if("dateRange".equals(filter.getField())){
						
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
						//开始时间小于等于结束时间
						query.add(query.getCriterion("startTime", eTime, "le"));
						//结束时间大于等于开始时间
						query.add(query.getCriterion("endTime", sTime, "ge"));
						//如果theme相等于filter集合中的Field
					} else if("theme".equals(filter.getField())){
						//条件主题等于(theme)filter
						query.add(query.getCriterion("theme", filter));
					}
				}
			}
		}
		
		query.desc("publishTime");
		//返回集合
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
