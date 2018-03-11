/**
 * @File Name		: MaterialDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("materialDao")
public class MaterialDaoImpl extends DaoImpl<MaterialPO> implements MaterialDao {
	
	public MaterialDaoImpl(){
		super(MaterialPO.class);
	}

	@Override
	public List<MaterialPO> pageMaterial(Paging paging, List<Filter> filters){
		
		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);
		
		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, "", "ne"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialByOrderId(Paging paging, List<Filter> filters, String orderId,String userId){
		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);
		
		query.alias("salesman", "salesman");
		query.alias("instorer", "instorer");
		query.alias("materialer", "materialer");
		
		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));
		query.add(Restrictions.or(Restrictions.or(query.getCriterion(MaterialPO.COLUMN_SALESMANID_STR,userId,"eq"),query.getCriterion(MaterialPO.COLUMN_INSTOREID_STR,userId,"eq")),query.getCriterion(MaterialPO.COLUMN_MATERIALID_STR,userId,"eq")));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<MaterialPO> pageMaterialForAdvance(Paging paging, List<Filter> filters, String orderId) {
		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);
		query.add(query.getCriterion(MaterialPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT, "ne"));
		queryFilterExcute(query, filters);
		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialPreBalance(Paging paging, List<Filter> filters,int company){
		
		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);
		query.add(query.getCriterion("company", company, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_INIT_INT, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_FULLSTATUS_STR, MaterialPO.FINANCE_STATUS_TYPE_CONFIRM_INT, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialPO> pageMaterialPostBalance(Paging paging, List<Filter> filters,int company){
		
		PagingQuery<MaterialPO> query = pagingQuery(paging, MaterialPO.class);
		
		query.add(query.getCriterion(MaterialPO.COLUMN_BALANCESTATUS_STR, MaterialPO.BALANCE_STATUS_TYPE_PRE_INT, "eq"));
		query.add(query.getCriterion(MaterialPO.COLUMN_FULLSTATUS_STR, MaterialPO.FINANCE_STATUS_TYPE_CONFIRM_INT, "eq"));
		query.add(query.getCriterion("company", company, "eq"));
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialPO> queryMaterial(List<Filter> filters){
		
		PagingQuery<MaterialPO> query = pagingQuery(new Paging(), MaterialPO.class);
		
		query.notPaging();
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPO> queryMaterialByMid(List<Long> mids){
		return session().createCriteria(MaterialPO.class).add(Restrictions.in(MaterialPO.COLUMN_MID_STR, mids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPO> queryMaterialByOrderId(String orderId){
		return session().createCriteria(MaterialPO.class).add(Restrictions.eq(MaterialPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public MaterialPO queryMaterialByNo(String msoNo){
		return (MaterialPO) session().createCriteria(MaterialPO.class)
				.add(Restrictions.eq(MaterialPO.COLUMN_NO_STR, msoNo))
				.add(Restrictions.ne(MaterialPO.COLUMN_STATUS_STR, MaterialPO.STATUS_TYPE_DELETE_INT))
				.uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			query.alias("instorer", "instorer");
			query.alias("customer", "customer");
			query.alias("house", "house");
			query.alias("house.village", "village");
			query.alias("salesman", "salesman");
			
			if(MaterialPO.COLUMN_NO_STR.equals(field)){
				query.add(query.getCriterion(field, data, op));
			}else if(MaterialPO.COLUMN_INSTOREID_STR.equals(field)){
				query.add(query.getCriterion("instorer.userId", data, op));
			}else if(MaterialPO.COLUMN_MATERIALBRAND_STR.equals(field)){
				query.add(query.getCriterion(MaterialPO.COLUMN_MATERIALBRAND_STR, data, op));
			}else if("customer.cid".equals(field)){
				query.add(query.getCriterion("customer.cid", data, op));
			}else if(MaterialPO.COLUMN_VILLAGE_ID_STR.equals(field)){
				query.add(query.getCriterion("village.no", data, op));
			}else if(MaterialPO.COLUMN_HOUSE_NUMBER__STR.equals(field)){
				query.add(query.getCriterion("house.houseNumber", data, op));
			}else if(MaterialPO.COLUMN_ORDERID_STR.equals(field)){
				query.add(query.getCriterion(field, data, op));
			}else if(MaterialPO.COLUMN_SALESMAN_STR.equals(field)){
				query.add(query.getCriterion("salesman.userId", data, op));
			}else if("fullStatusRange".equals(field)){
				String[] status = data.split(",");
				
				if(status.length > 0){
					
					Criterion criterion = Restrictions.eq(MaterialPO.COLUMN_FULLSTATUS_STR, Short.valueOf(status[0]));
					
					for(int i = 1;i<status.length;i++){
						criterion = Restrictions.or(Restrictions.eq(MaterialPO.COLUMN_FULLSTATUS_STR, Short.valueOf(status[i])), criterion);
					}
					
					query.add(criterion);
				}
			}else if(MaterialPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(field)){
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialPO.COLUMN_FULLPAYTIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialPO.COLUMN_FULLPAYTIME_STR, sTimestamp, "ge"));
			}
		}
	}
	
}
