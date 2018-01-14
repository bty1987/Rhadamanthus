/**
 * @File Name		: MaterialPreBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-4-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialBalanceDao;
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("materialBalanceDao")
public class MaterialBalanceDaoImpl extends DaoImpl<MaterialBalancePO> implements MaterialBalanceDao {
	
	public MaterialBalanceDaoImpl(){
		super(MaterialBalancePO.class);
	}

	@Override
	public List<MaterialBalancePO> pageMaterialBalance(Paging paging, List<Filter> filters,int company) {
		
		PagingQuery<MaterialBalancePO> query = pagingQuery(paging, MaterialBalancePO.class);
		query.add(query.getCriterion("material.company", company, "eq"));
		
		queryFilterExecute(query, filters);
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		query.alias("material", "material");
		
		for(Filter filter: filters){
			if(MaterialPO.COLUMN_NO_STR.equals(filter.getField())){
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_MSONO_STR, filter.getData()));
			}else if(MaterialPO.COLUMN_ORDERID_STR.equals(filter.getField())){
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_ORDERID_STR, filter.getData()));
			}else if(MaterialPO.COLUMN_INSTOREID_STR.equals(filter.getField())){
				query.alias("instorer", "instorer");
				query.add(Restrictions.eq(MaterialBalancePO.COLUMN_INSTOREID_STR, filter.getData()));
			}else if(MaterialBalancePO.COLUMN_TYPE_STR.equals(filter.getField())){//根据类型查询
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_TYPE_STR, Short.parseShort(filter.getData()), filter.getOp()));
			}else if(MaterialBalancePO.COLUMN_STATUS_STR.equals(filter.getField())){
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_STATUS_STR, Short.parseShort(filter.getData()), filter.getOp()));
			}else if(MaterialPO.COLUMN_MATERIALBRAND_STR.equals(filter.getField())){//增加品牌模糊查询
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_MATERIALBRAND_STR, filter.getData(), filter.getOp()));
			}else if(MaterialPO.COLUMN_VILLAGE_ID_STR.equals(filter.getField())){//增加楼盘地址模糊查询
				query.alias("material.house", "house");
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", filter.getData(), filter.getOp()));
			}else if(MaterialPO.COLUMN_REGIONID_STR.equals(filter.getField())){//增加归属大区名字模糊查询
				query.alias("material.region", "region");
				query.add(Restrictions.eq("region.deptId", filter.getData()));
			}else if(MaterialPO.COLUMN_DEPARTMENTID_STR.equals(filter.getField())){//增加业务大区名字模糊查询
				query.alias("material.department", "department");
				query.add(Restrictions.eq("department.deptId", filter.getData()));
			}
			else if(MaterialPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(filter.getField())){
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_FULLPAYTIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_FULLPAYTIME_STR, sTimestamp, "ge"));
			}
			//增加预结算时间查询条件
			else if(MaterialPO.COLUMN_PREBALANCETIME_RANGE_STR.equals(filter.getField())){
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_PREBALANCETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_PREBALANCETIME_STR, sTimestamp, "ge"));
			}
			//增加结算时间查询条件
			else if(MaterialPO.COLUMN_POSTBALANCETIME_RANGE_STR.equals(filter.getField())){
				String data = filter.getData();
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_POSTBALANCETIME_STR,eTimestamp, "le"));
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_POSTBALANCETIME_STR, sTimestamp, "ge"));
			}
			//增加厂商结算时间查询条件
			else if(MaterialPO.COLUMN_VBALANCETIME_RANGE_STR.equals(filter.getField())){
				String data = filter.getData();
				//取得开始时间和结束时间 -分割
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				//格式化时间
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_VBALANCETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialBalancePO.COLUMN_VBALANCETIME_STR, sTimestamp, "ge"));
			}
		}
	}
	
}
