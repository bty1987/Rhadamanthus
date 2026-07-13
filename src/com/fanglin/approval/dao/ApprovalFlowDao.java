/**
 * @File Name		: ApprovalFlowDao.java
 * @Package   		: com.fanglin.approval.dao
 * @Version			: 1.0
 * @Description		: 审批流程定义 DAO
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ApprovalFlowPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalFlowDao extends Dao<ApprovalFlowPO> {

	public List<ApprovalFlowPO> pageApprovalFlow(Paging paging, List<Filter> filters);

	/**
	 * 按业务类型 + 公司查询启用的流程定义。
	 * company=0 表示全公司通用,查询时同时匹配 company 和 0。
	 */
	public ApprovalFlowPO queryEnabledFlow(short businessType, int company);

	public ApprovalFlowPO queryApprovalFlow(String code, int company, int version);

	/**
	 * 查询公司下全部流程定义(不分页,按 businessType 升序)。
	 */
	public List<ApprovalFlowPO> queryApprovalFlow(int company);

}
