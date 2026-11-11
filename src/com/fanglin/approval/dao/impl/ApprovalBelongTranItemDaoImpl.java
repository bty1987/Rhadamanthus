/**
 * @File Name		: ApprovalBelongTranItemDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ApprovalBelongTranItemDao;
import com.fanglin.approval.po.ApprovalBelongTranItemPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("approvalBelongTranItemDao")
public class ApprovalBelongTranItemDaoImpl extends DaoImpl<ApprovalBelongTranItemPO> implements ApprovalBelongTranItemDao {

	public ApprovalBelongTranItemDaoImpl() {
		super(ApprovalBelongTranItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ApprovalBelongTranItemPO> queryApprovalBelongTranItemByAbtId(int abtId) {
		return session().createCriteria(ApprovalBelongTranItemPO.class).add(Restrictions.eq(ApprovalBelongTranItemPO.COLUMN_ABTID_STR, abtId)).list();
	}

	@Override
	public int countApprovalBelongTranItemForInit(String orderId, short belongType) {

		// 该单该类型是否存在待审(status=0)的在途移交审批(与approval主行联结判定)
		String sql = "SELECT COUNT(*) FROM approval.approvalbelongtranitem i JOIN approval.approvalbelongtran t ON t.abtId = i.abtId JOIN approval.approval a ON a.aid = t.aId WHERE i.orderId = :orderId AND i.belongType = :belongType AND a.status = 0";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("belongType", belongType).setMaxResults(1).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

}
