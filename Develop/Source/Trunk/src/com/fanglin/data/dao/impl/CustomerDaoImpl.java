/**
 * Title: CustomerDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.data.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.dao.CustomerDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.utils.Paging;

@Repository("customerDao")
public class CustomerDaoImpl extends DaoImpl<CustomerPO> implements CustomerDao {

	public CustomerDaoImpl(){
		super(CustomerPO.class);
	}

	@Override
	public List<CustomerPO> pageCustomer(Paging paging, List<FilterVO> filters){

		PagingQuery<CustomerPO> query = pagingQuery(paging, CustomerPO.class);
		
		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<CustomerPO> queryCustomerForNameByPinyin(Paging paging, String pinyinName){

		PagingQuery<CustomerPO> query = pagingQuery(paging, CustomerPO.class);
		
		if(StringUtils.isNotEmpty(pinyinName)){
			query.add(Restrictions.or(Restrictions.or(Restrictions.ilike("customerName", pinyinName, MatchMode.ANYWHERE), Restrictions.ilike("customerNamePYAll", pinyinName, MatchMode.ANYWHERE)), Restrictions.ilike("phone", pinyinName, MatchMode.ANYWHERE)));
		}
		
		return query.list();
	}

	@Override
	public CustomerPO queryCustomerByCustomerId(String customerId){
		return (CustomerPO) session().createCriteria(CustomerPO.class).add(Restrictions.eq("customerId", customerId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerPO> queryCustomerByPhone(String phone){
		return session().createCriteria(CustomerPO.class).add(Restrictions.ilike("phone", phone, MatchMode.ANYWHERE)).list();
	}

	@Override
	public CustomerPO queryCustomerFromCommunionById(int cId) {
		return (CustomerPO) communionSession().createCriteria(CustomerPO.class).add(Restrictions.eq("id", cId)).uniqueResult();
	}

	@Override
	public int merge(CustomerPO customerPO) {
		
		communionSession().merge(customerPO);
		
		return 0;
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			for(FilterVO filter : filters){
				if("customerName".equals(filter.getField())){
					query.add(query.getCriterion("customerName", filter));
				} else if("customerPhone".equals(filter.getField())){
					query.add(query.getCriterion("phone", filter));
				} else if("relationshipType".equals(filter.getField())){
					query.add(query.getCriterion("relationshipType", filter));
				}
			}
		}
	}
	
}
