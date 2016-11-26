/**
 * @File Name		: DRegionCountDetailDaoImpl.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.DRegionCountDetailDao;
import com.fanglin.report.po.DRegionCountDetailPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("dRegionCountDetailDao")
public class DRegionCountDetailDaoImpl extends DaoImpl<DRegionCountDetailPO> implements DRegionCountDetailDao {
	
	public DRegionCountDetailDaoImpl(){
		super(DRegionCountDetailPO.class);
	}
	
	@Override
	public List<DRegionCountDetailPO> queryDRegionCountDetail(List<FilterVO> filters) throws ParseException {
		
		PagingQuery<DRegionCountDetailPO> query = pagingQuery(new Paging(), DRegionCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters) throws ParseException{
		
		for(FilterVO filterVO: filters){
			
			String field = filterVO.getField();
			String data = filterVO.getData();
			String op = filterVO.getOp();
			
			if("designRegionId".equals(field)){
				query.alias("designRegion", "designRegion");
				query.add(query.getCriterion(DRegionCountDetailPO.COLUMN_DESIGN_DEPTID_STR, data, op));
			}else if("salesmanRegionId".equals(field)){
				query.alias("salesmanRegion", "salesmanRegion");
				query.add(query.getCriterion(DRegionCountDetailPO.COLUMN_SALESMAN_DEPTID_STR, data, op));
			}else if("createDate".equals(field)){
				query.add(query.getCriterion(DRegionCountDetailPO.COLUMN_CREATEDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(data), op));
			}else if("createDateRange".equals(field)){
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(DRegionCountDetailPO.COLUMN_CREATEDATE_STR, eTimestamp, "le"));
				query.add(query.getCriterion(DRegionCountDetailPO.COLUMN_CREATEDATE_STR, sTimestamp, "ge"));
			}
		}
		
	}

}
