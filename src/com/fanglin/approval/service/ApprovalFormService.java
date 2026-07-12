/**
 * @File Name		: ApprovalFormService.java
 * @Package   		: com.fanglin.approval.service
 * @Version			: 1.0
 * @Description		: 审批表单定义管理服务。表单 + 字段增删改查,供流程配置后台使用。
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.vo.ApprovalFormFieldVO;
import com.fanglin.approval.vo.ApprovalFormVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalFormService {

	public void pageApprovalForm(Paging paging, List<Filter> filters, int company);

	public ApprovalFormVO queryApprovalFormByFormId(ApprovalFormVO formVO) throws FLException;

	/** 按流程定义ID查询关联的表单 */
	public ApprovalFormVO queryApprovalFormByFlowId(Long flowId);

	/** 查询表单下的全部字段定义 */
	public List<ApprovalFormFieldVO> queryApprovalFormField(ApprovalFormVO formVO);

	public void addApprovalForm(ApprovalFormVO formVO, List<ApprovalFormFieldVO> fieldVOs, int company) throws FLException;

	public void updateApprovalForm(ApprovalFormVO formVO, List<ApprovalFormFieldVO> fieldVOs) throws FLException;

	public void updateApprovalFormForStatus(ApprovalFormVO formVO) throws FLException;

	public void deleteApprovalForm(ApprovalFormVO formVO) throws FLException;

}
