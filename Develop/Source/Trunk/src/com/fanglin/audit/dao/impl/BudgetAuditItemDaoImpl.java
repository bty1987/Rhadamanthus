/**
 * Title: BudgetAuditDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.audit.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.audit.dao.BudgetAuditItemDao;
import com.fanglin.audit.po.BudgetAuditItemPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

@Repository("budgetAuditDao")
public class BudgetAuditItemDaoImpl extends DaoImpl<BudgetAuditItemPO> implements BudgetAuditItemDao {

	public BudgetAuditItemDaoImpl(){
		super(BudgetAuditItemPO.class);
	}
	
	@Override
	public List<BudgetAuditItemPO> pageBudgetAuditByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<BudgetAuditItemPO> query = pagingQuery(paging, BudgetAuditItemPO.class);
		
		query.add(Restrictions.eq(BudgetAuditItemPO.COLUMN_ORDERID_STR, orderId));
		
		if(filters != null){
			for(FilterVO filterVO: filters){
				query.add(query.getCriterion(filterVO.getField(), filterVO.getData(), filterVO.getOp()));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<BudgetAuditItemPO> queryBudgetAuditByOrderId(String orderId){
		return createCriteria(BudgetAuditItemPO.class).add(Restrictions.eq("orderId", orderId)).addOrder(Order.asc("itemId")).list();
	}

	@Override
	public void deleteBudgetAuditByOrderId(String orderId){
		String sql = "delete from platform.budgetaudit where orderId = :orderId";
		session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();
	}

}
