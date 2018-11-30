/**
 * @File Name		: ManifestDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("manifestDao")
public class ManifestDaoImpl extends DaoImpl<ManifestPO> implements ManifestDao {
	
	public ManifestDaoImpl(){
		super(ManifestPO.class);
	}

	@Override
	public List<ManifestPO> pageManifest(Paging paging, List<Filter> filters , int company) {
		
		PagingQuery<ManifestPO> query = pagingQuery(paging, ManifestPO.class);
		
		query.add(query.getCriterion(ManifestPO.COLUMN_COMPANY_STR,company,"eq"));
		
		queryFilterExecute(query, filters);
		
		query.desc("mid");
		
		return query.list();
	}

	@Override
	public List<ManifestPO> queryManifest(List<Filter> filters) {
		
		PagingQuery<ManifestPO> query = pagingQuery(new Paging(), ManifestPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null && filters.size() > 0){
			
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(ManifestPO.COLUMN_ORDERID_STR, data, op));
				}else if("manifestTime".equals(field)){
				/*	String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(ManifestPO.COLUMN_MANIFESTTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(ManifestPO.COLUMN_MANIFESTTIME_STR, sTimestamp, "ge"));*/
					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";
					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);
					
					query.add(query.getCriterion(ManifestPO.COLUMN_MANIFESTTIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(ManifestPO.COLUMN_MANIFESTTIME_STR, etimestamp, "le"));
					
				}else if(ManifestPO.COLUMN_CODE_STR.equals(field)){
					query.add(query.getCriterion(ManifestPO.COLUMN_CODE_STR, data, op));
				}else if("createrName".equals(field)){
					query.alias("createUser", "createUser");
					query.add(query.getCriterion(ManifestPO.COLUMN_CREATEUSER_USERID_STR, data, op));
				}
			}
		}
	}

}
