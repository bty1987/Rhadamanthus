/**
 * @File Name		: ApprovalFormDataDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批表单填写数据 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFormDataPO;
import com.fanglin.core.dao.Dao;

public interface ApprovalFormDataDao extends Dao<ApprovalFormDataPO> {

	/** 查询某审批单的全部表单数据(联表字段定义需在 Service 层组装) */
	public List<ApprovalFormDataPO> queryApprovalFormDataByAid(long aid);

	/** 查询某审批单某字段的数据 */
	public ApprovalFormDataPO queryApprovalFormData(long aid, long fieldId);

}
