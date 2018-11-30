package com.fanglin.customer.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.FeedBackDao;
import com.fanglin.customer.po.FeedbackPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("feedBackDao")
public class FeedBackDaoImpl extends DaoImpl<FeedbackPO> implements FeedBackDao{
	
	public FeedBackDaoImpl(){
		super(FeedbackPO.class);
	}

	@Override
	public List<FeedbackPO> pageFeedback(Paging paging, List<Filter> filters) {
		
		PagingQuery<FeedbackPO> query = pagingQuery(paging, FeedbackPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
		
	}
	
	private void queryFilterExcute(PagingQuery<FeedbackPO> query,List<Filter> filters) {
		
		if (filters != null){
			for (Filter filter : filters){
				
				if("createTime".equals(filter.getField())){
					
					String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion("createTime", eTimestamp, "le"));
					query.add(query.getCriterion("createTime", sTimestamp, "ge"));

			 }
			}
		}
	}

}
