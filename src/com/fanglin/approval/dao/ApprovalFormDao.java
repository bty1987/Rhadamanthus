/**
 * @File Name		: ApprovalFormDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批表单定义 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFormPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalFormDao extends Dao<ApprovalFormPO> {

	public List<ApprovalFormPO> pageApprovalForm(Paging paging, List<Filter> filters);

	/** 按流程定义ID查询表单 */
	public ApprovalFormPO queryApprovalFormByFlowId(long flowId);

	/** 按编码 + 公司查询 */
	public ApprovalFormPO queryApprovalForm(String code, int company);

	/**
	 * 查询公司下全部表单定义(不分页,按 code 升序)。
	 */
	public List<ApprovalFormPO> queryApprovalForm(int company);

}
