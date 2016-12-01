/**
 * @File Name		: DDepartmentCountDetailDaoImpl.java
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
import com.fanglin.report.dao.DDepartmentCountDetailDao;
import com.fanglin.report.po.DDepartmentCountDetailPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("dDepartmentCountDetailDao")
public class DDepartmentCountDetailDaoImpl extends DaoImpl<DDepartmentCountDetailPO> implements DDepartmentCountDetailDao {

	public DDepartmentCountDetailDaoImpl(){
		super(DDepartmentCountDetailPO.class);
	}

	@Override
	public List<DDepartmentCountDetailPO> queryDDepartmentCountDetail(List<Filter> filters) throws ParseException {
		
		PagingQuery<DDepartmentCountDetailPO> query = pagingQuery(new Paging(), DDepartmentCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws ParseException{
		
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if("designDepartmentId".equals(field)){
				query.alias("designDepartment", "designDepartment");
				query.add(query.getCriterion(DDepartmentCountDetailPO.COLUMN_DESIGN_DEPTID_STR, data, op));
			}else if("salesmanDepartmentId".equals(field)){
				query.alias("salesmanDepartment", "salesmanDepartment");
				query.add(query.getCriterion(DDepartmentCountDetailPO.COLUMN_SALESMAN_DEPTID_STR, data, op));
			}else if("createDate".equals(field)){
				query.add(query.getCriterion(DDepartmentCountDetailPO.COLUMN_CREATEDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(data), op));
			}else if("createDateRange".equals(field)){
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(DDepartmentCountDetailPO.COLUMN_CREATEDATE_STR, eTimestamp, "le"));
				query.add(query.getCriterion(DDepartmentCountDetailPO.COLUMN_CREATEDATE_STR, sTimestamp, "ge"));
			}
		}
		
	}

}
