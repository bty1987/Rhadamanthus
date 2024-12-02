package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalFunctionDao;
import com.fanglin.approval.po.ApprovalFunctionPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalFunctionDao")
public class ApprovalFunctionDaoImpl extends DaoImpl<ApprovalFunctionPO> implements ApprovalFunctionDao {

	public ApprovalFunctionDaoImpl() {
		super(ApprovalFunctionPO.class);

	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalFunctionPO> queryApprovalFunction(Short type, String fieldType) {

		Criteria criteria = session().createCriteria(ApprovalFunctionPO.class).add(Restrictions.eq("status", ApprovalFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		if (ApprovalFunctionPO.FIELDTYPE.equals(fieldType)) {
			fieldType = "origin";
		}

		if (fieldType != null) {
			Disjunction disjunction = Restrictions.disjunction();
			disjunction.add(Restrictions.eq("fieldType", fieldType));
			disjunction.add(Restrictions.eq("fieldType", "share"));
			criteria.add(disjunction);
		}

		return criteria.list();
	}

}
