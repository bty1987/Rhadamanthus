/**
 * @File Name		: ApprovalFormFieldDaoImpl.java
 * @Package   		: com.fanglin.approval.dao.impl
 * @Version			: 1.0
 * @Description		: 审批表单字段定义 DAO 实现
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFormFieldDao;
import com.fanglin.approval.po.ApprovalFormFieldPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalFormFieldDao")
public class ApprovalFormFieldDaoImpl extends DaoImpl<ApprovalFormFieldPO> implements ApprovalFormFieldDao {

	public ApprovalFormFieldDaoImpl() {
		super(ApprovalFormFieldPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalFormFieldPO> queryApprovalFormFieldByFormId(long formId) {

		return session().createCriteria(ApprovalFormFieldPO.class)
			.add(Restrictions.eq("formId", formId))
			.add(Restrictions.eq("status", ApprovalFormFieldPO.STATUS_ENABLED_INT))
			.addOrder(Order.asc("sortOrder"))
			.list();
	}

	@Override
	public int deleteApprovalFormFieldByFormId(long formId) {

		String sql = "DELETE FROM approval.approvalformfield WHERE formId = :formId";

		return session().createSQLQuery(sql).setLong("formId", formId).executeUpdate();
	}

}
