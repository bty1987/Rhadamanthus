/**
 * @File Name		: ApprovalFormDataDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批表单填写数据 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFormDataDao;
import com.fanglin.approval.po.ApprovalFormDataPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalFormDataDao")
public class ApprovalFormDataDaoImpl extends DaoImpl<ApprovalFormDataPO> implements ApprovalFormDataDao {

	public ApprovalFormDataDaoImpl() {
		super(ApprovalFormDataPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalFormDataPO> queryApprovalFormDataByAid(long aid) {

		return session().createCriteria(ApprovalFormDataPO.class)
			.add(Restrictions.eq("aid", aid))
			.addOrder(Order.asc("fieldId"))
			.list();
	}

	@Override
	public ApprovalFormDataPO queryApprovalFormData(long aid, long fieldId) {

		return (ApprovalFormDataPO) session().createCriteria(ApprovalFormDataPO.class)
			.add(Restrictions.eq("aid", aid))
			.add(Restrictions.eq("fieldId", fieldId))
			.uniqueResult();
	}

}
