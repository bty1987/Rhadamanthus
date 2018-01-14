/**
 * Title: CustomerDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;

import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.CustomerPhonePO;
import com.fanglin.utils.Paging;

@Repository("customerDao")
public class CustomerDaoImpl extends DaoImpl<CustomerPO> implements CustomerDao {

	public CustomerDaoImpl(){
		super(CustomerPO.class);
	}
	
	@Override
	public List<CustomerPO> pageCustomer(Paging paging, List<Filter> filters){

		PagingQuery<CustomerPO> query = pagingQuery(paging, CustomerPO.class);
		
		queryFilterExcute(query, filters);

		query.asc("cid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomerByPinyin(String pinyinName, int limit){
	
		String likestr = String.format("%s%%", pinyinName);
		
		StringBuffer sql = new StringBuffer();

		sql.append("select c.* ");
		sql.append("from communion.customer c left join communion.customerphone cp on c.cid = cp.cid ");
		sql.append("where (c.pinyinAll like :pinyinAll or c.pinyinAB like :pinyinAB or c.name like :name) or (cp.phone like :phone and status = :status) ");
		sql.append("group by c.cid ");
		sql.append("limit :limit ");

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerPO.class);
		query.setString("pinyinAll", likestr).setString("pinyinAB", likestr).setString("name", likestr).setString("phone", likestr).setShort("status", CustomerPhonePO.STATUS_ENABLE_INT).setInteger("limit", limit);
	
		return query.list();
	}
	
	@Override
	public CustomerPO queryCustomerByNo(String no){
		return (CustomerPO) session().createCriteria(CustomerPO.class).add(Restrictions.eq("no", no)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			for(Filter filter : filters){
				if("customerName".equals(filter.getField())){
					query.add(query.getCriterion("customerName", filter));
				} else if("relationshipType".equals(filter.getField())){
					query.add(query.getCriterion("relationshipType", filter));
				}
			}
		}
	}

}
