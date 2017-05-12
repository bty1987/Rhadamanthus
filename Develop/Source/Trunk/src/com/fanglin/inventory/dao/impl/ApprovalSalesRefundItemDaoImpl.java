package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.ApprovalSalesRefundItemDao;
import com.fanglin.inventory.po.ApprovalSalesRefundItemPO;

@Repository("approvalSalesRefundItemDao")
public class ApprovalSalesRefundItemDaoImpl extends DaoImpl<ApprovalSalesRefundItemPO> implements ApprovalSalesRefundItemDao{

	public ApprovalSalesRefundItemDaoImpl(){
		super(ApprovalSalesRefundItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ApprovalSalesRefundItemPO> queryApprovalSalesRefundItemByAsrId(long asrid) {
		return session().createCriteria(ApprovalSalesRefundItemPO.class).add(Restrictions.eq(ApprovalSalesRefundItemPO.COLUMN_ASRID_STR, asrid)).list();
	}

}
