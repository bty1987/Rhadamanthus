/**
 * @File Name		: ApprovalBelongTranDao.java
 * @Package   	: com.fanglin.approval.dao
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao;

import com.fanglin.approval.po.ApprovalBelongTranPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalBelongTranDao extends Dao<ApprovalBelongTranPO> {

	public ApprovalBelongTranPO queryApprovalBelongTranByAId(long aId);

}
