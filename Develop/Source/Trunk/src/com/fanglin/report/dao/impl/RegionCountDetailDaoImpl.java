/**
 * @File Name		: RegionCountDetailDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
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
import com.fanglin.report.dao.RegionCountDetailDao;
import com.fanglin.report.po.RegionCountDetailPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("regionCountDetailDao")
public class RegionCountDetailDaoImpl extends DaoImpl<RegionCountDetailPO> implements RegionCountDetailDao {
	
	public RegionCountDetailDaoImpl(){
		super(RegionCountDetailPO.class);
	}
	
	@Override
	public List<RegionCountDetailPO> pageRegionCountDetail(Paging paging, List<Filter> filters) throws ParseException {
		
		PagingQuery<RegionCountDetailPO> query = pagingQuery(paging, RegionCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public List<RegionCountDetailPO> queryRegionCountDetail(List<Filter> filters) throws ParseException {
		
		PagingQuery<RegionCountDetailPO> query = pagingQuery(new Paging(), RegionCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws ParseException{
		
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if("createDate".equals(field)){
				Date date = new SimpleDateFormat("yyyy-MM-dd").parse(data);
				query.add(query.getCriterion(field, date, op));
			}else if("createDateRange".equals(field)){
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(RegionCountDetailPO.COLUMN_CREATEDATE_STR, eTimestamp, "le"));
				query.add(query.getCriterion(RegionCountDetailPO.COLUMN_CREATEDATE_STR, sTimestamp, "ge"));
			}
		}
		
	}

}
