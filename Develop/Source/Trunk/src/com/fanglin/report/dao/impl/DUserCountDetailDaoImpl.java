/**
 * @File Name		: DUserCountDetailDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.DUserCountDetailDao;
import com.fanglin.report.po.DUserCountDetailPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("dUserCountDetailDao")
public class DUserCountDetailDaoImpl extends DaoImpl<DUserCountDetailPO> implements DUserCountDetailDao {
	
	public DUserCountDetailDaoImpl(){
		super(DUserCountDetailPO.class);
	}

	@Override
	public List<DUserCountDetailPO> queryDUserCountDetail(List<Filter> filters) throws ParseException {
		
		PagingQuery<DUserCountDetailPO> query = pagingQuery(new Paging(), DUserCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws ParseException{
		
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if("designerUserId".equals(field)){
				query.alias("designer", "designer");
				query.add(query.getCriterion(DUserCountDetailPO.COLUMN_DESIGNER_USERID_STR, data, op));
			}else if("salesmanUserId".equals(field)){
				query.alias("salesman", "salesman");
				query.add(query.getCriterion(DUserCountDetailPO.COLUMN_SALEMSNA_USERID_STR, data, op));
			}else if("createDate".equals(field)){
				query.add(query.getCriterion(DUserCountDetailPO.COLUMN_CREATEDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(data), op));
			}else if("createDateRange".equals(field)){
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(DUserCountDetailPO.COLUMN_CREATEDATE_STR, eTimestamp, "le"));
				query.add(query.getCriterion(DUserCountDetailPO.COLUMN_CREATEDATE_STR, sTimestamp, "ge"));
			}
		}
	}
	
}
