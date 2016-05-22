/**
 * @File Name		: MaterialSubOrderDaoImpl.java
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

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("materialSubOrderDao")
public class MaterialSubOrderDaoImpl extends DaoImpl<MaterialSubOrderPO> implements MaterialSubOrderDao {
	
	public MaterialSubOrderDaoImpl(){
		super(MaterialSubOrderPO.class);
	}

	@Override
	public List<MaterialSubOrderPO> pageMaterialSubOrder(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialSubOrderPO> query = pagingQuery(paging, MaterialSubOrderPO.class);
		
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_ORDERID_STR, "", "ne"));
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_STATUS_STR, MaterialSubOrderPO.STATUS_TYPE_DELETE_INT, "ne"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialSubOrderPO> pageMaterialSubOrderByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<MaterialSubOrderPO> query = pagingQuery(paging, MaterialSubOrderPO.class);
		
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_STATUS_STR, MaterialSubOrderPO.STATUS_TYPE_DELETE_INT, "ne"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialSubOrderPO> pageMaterialSubOrderPreBalance(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialSubOrderPO> query = pagingQuery(paging, MaterialSubOrderPO.class);
		
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_BALANCESTATUS_STR, MaterialSubOrderPO.BALANCE_STATUS_TYPE_INIT_INT, "eq"));
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_FULLSTATUS_STR, MaterialSubOrderPO.FINANCE_STATUS_TYPE_CONFIRM_INT, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialSubOrderPO> pageMaterialSubOrderPostBalance(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialSubOrderPO> query = pagingQuery(paging, MaterialSubOrderPO.class);
		
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_BALANCESTATUS_STR, MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT, "eq"));
		query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_FULLSTATUS_STR, MaterialSubOrderPO.FINANCE_STATUS_TYPE_CONFIRM_INT, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialSubOrderPO> queryMaterialSubOrder(List<FilterVO> filters){
		
		PagingQuery<MaterialSubOrderPO> query = pagingQuery(new Paging(), MaterialSubOrderPO.class);
		
		query.notPaging();
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderPO> queryMaterialSubOrderByMsoId(List<Long> msoIds){
		return session().createCriteria(MaterialSubOrderPO.class).add(Restrictions.in(MaterialSubOrderPO.COLUMN_MSOID_STR, msoIds)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderPO> queryMaterialSubOrderByOrderId(String orderId){
		return session().createCriteria(MaterialSubOrderPO.class).add(Restrictions.eq(MaterialSubOrderPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@Override
	public MaterialSubOrderPO queryMaterialSubOrderByMsoNo(String msoNo){
		return (MaterialSubOrderPO) session().createCriteria(MaterialSubOrderPO.class)
				.add(Restrictions.eq(MaterialSubOrderPO.COLUMN_MSONO_STR, msoNo))
				.add(Restrictions.ne(MaterialSubOrderPO.COLUMN_STATUS_STR, MaterialSubOrderPO.STATUS_TYPE_DELETE_INT))
				.uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		for(FilterVO filter: filters){
			if(MaterialSubOrderPO.COLUMN_MSONO_STR.equals(filter.getField())){
				query.add(Restrictions.eq(filter.getField(), filter.getData()));
			}else if(MaterialSubOrderPO.COLUMN_INSTOREID_STR.equals(filter.getField())){
				query.add(Restrictions.eq(filter.getField(), filter.getData()));
			}else if(MaterialSubOrderPO.COLUMN_ORDERADDR_STR.equals(filter.getField())){
				query.add(Restrictions.ilike(filter.getField(), filter.getData(), MatchMode.ANYWHERE));
			}else if(MaterialSubOrderPO.COLUMN_ORDERID_STR.equals(filter.getField())){
				query.add(Restrictions.eq(filter.getField(), filter.getData()));
			}else if(MaterialSubOrderPO.COLUMN_SALESMANNAME_STR.equals(filter.getField()) || MaterialSubOrderPO.COLUMN_DESIGNERNAME_STR.equals(filter.getField())){
				query.add(Restrictions.ilike(MaterialSubOrderPO.COLUMN_SALESMANNAME_STR, filter.getData(), MatchMode.ANYWHERE));
			}else if(MaterialSubOrderPO.COLUMN_SALESMANID_STR.equals(filter.getField())){
				query.add(Restrictions.ilike(filter.getField(), filter.getData(), MatchMode.ANYWHERE));
			}else if(MaterialSubOrderPO.COLUMN_FULLCOLLECTTIME_RANGE_STR.equals(filter.getField())){
				
				String data = filter.getData();
				
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_FULLCOLLECTTIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(MaterialSubOrderPO.COLUMN_FULLCOLLECTTIME_STR, sTimestamp, "ge"));
			}
		}
	}
	
}
