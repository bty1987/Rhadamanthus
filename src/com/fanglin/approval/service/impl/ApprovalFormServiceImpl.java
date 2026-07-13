/**
 * @File Name		: ApprovalFormServiceImpl.java
 * @Package   		: com.fanglin.approval.service.impl
 * @Version			: 1.0
 * @Description		: 审批表单定义管理服务实现。仿照 ApprovalFlowServiceImpl 的 CRUD 模式。
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalFormFieldDao;
import com.fanglin.approval.dao.ApprovalFormDao;
import com.fanglin.approval.po.ApprovalFormFieldPO;
import com.fanglin.approval.po.ApprovalFormPO;
import com.fanglin.approval.service.ApprovalFormService;
import com.fanglin.approval.vo.ApprovalFormFieldVO;
import com.fanglin.approval.vo.ApprovalFormVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("approvalFormService")
@Transactional(readOnly = true)
public class ApprovalFormServiceImpl implements ApprovalFormService {

	@Autowired
	private ApprovalFormDao approvalFormDao;

	@Autowired
	private ApprovalFormFieldDao approvalFormFieldDao;

	@Override
	public void pageApprovalForm(Paging paging, List<Filter> filters, int company) {

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<ApprovalFormPO> formPOs = approvalFormDao.pageApprovalForm(paging, filters);
		List<ApprovalFormVO> formVOs = new ArrayList<ApprovalFormVO>();

		for (ApprovalFormPO formPO : formPOs) {
			formVOs.add(formPOToVO(formPO));
		}

		paging.setData(formVOs);
	}

	@Override
	public List<ApprovalFormVO> queryApprovalForm(int company) {

		List<ApprovalFormPO> formPOs = approvalFormDao.queryApprovalForm(company);
		List<ApprovalFormVO> formVOs = new ArrayList<ApprovalFormVO>();

		for (ApprovalFormPO formPO : formPOs) {
			formVOs.add(formPOToVO(formPO));
		}

		return formVOs;
	}

	@Override
	public ApprovalFormVO queryApprovalFormByFormId(ApprovalFormVO formVO) throws FLException {

		ApprovalFormPO formPO = approvalFormDao.get(formVO.getFormId());

		if (formPO == null) {
			throw new FLException(240070, "表单不存在");
		}

		return formPOToVO(formPO);
	}

	@Override
	public ApprovalFormVO queryApprovalFormByFlowId(Long flowId) {

		if (flowId == null) {
			return null;
		}

		ApprovalFormPO formPO = approvalFormDao.queryApprovalFormByFlowId(flowId);

		return formPO == null ? null : formPOToVO(formPO);
	}

	@Override
	public List<ApprovalFormFieldVO> queryApprovalFormField(ApprovalFormVO formVO) {

		List<ApprovalFormFieldPO> fieldPOs = approvalFormFieldDao.queryApprovalFormFieldByFormId(formVO.getFormId());
		List<ApprovalFormFieldVO> fieldVOs = new ArrayList<ApprovalFormFieldVO>();

		for (ApprovalFormFieldPO fieldPO : fieldPOs) {
			ApprovalFormFieldVO fieldVO = new ApprovalFormFieldVO();
			BeanUtil.copyProperties(fieldPO, fieldVO);
			fieldVOs.add(fieldVO);
		}

		return fieldVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addApprovalForm(ApprovalFormVO formVO, List<ApprovalFormFieldVO> fieldVOs, int company) throws FLException {

		ApprovalFormPO exists = approvalFormDao.queryApprovalForm(formVO.getCode(), company);
		if (exists != null) {
			throw new FLException(240071, "表单编码已存在(code=" + formVO.getCode() + ")");
		}

		ApprovalFormPO formPO = new ApprovalFormPO();
		BeanUtil.copyProperties(formVO, formPO);
		formPO.setCompany(company);
		formPO.setStatus(ApprovalFormPO.STATUS_ENABLED_INT);

		approvalFormDao.save(formPO);

		saveFields(formPO.getFormId(), fieldVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateApprovalForm(ApprovalFormVO formVO, List<ApprovalFormFieldVO> fieldVOs) throws FLException {

		ApprovalFormPO formPO = approvalFormDao.get(formVO.getFormId());

		if (formPO == null) {
			throw new FLException(240070, "表单不存在");
		}

		BeanUtil.copyProperties(formVO, formPO, Arrays.asList("status", "company", "formId"));
		approvalFormDao.update(formPO);

		// 字段先删后建
		approvalFormFieldDao.deleteApprovalFormFieldByFormId(formPO.getFormId());
		saveFields(formPO.getFormId(), fieldVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateApprovalFormForStatus(ApprovalFormVO formVO) throws FLException {

		ApprovalFormPO formPO = approvalFormDao.get(formVO.getFormId());

		if (formPO == null) {
			throw new FLException(240070, "表单不存在");
		}

		formPO.setStatus(formVO.getStatus());
		approvalFormDao.update(formPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteApprovalForm(ApprovalFormVO formVO) throws FLException {

		ApprovalFormPO formPO = approvalFormDao.get(formVO.getFormId());

		if (formPO == null) {
			throw new FLException(240070, "表单不存在");
		}

		approvalFormFieldDao.deleteApprovalFormFieldByFormId(formPO.getFormId());
		approvalFormDao.delete(formPO);
	}

	private void saveFields(long formId, List<ApprovalFormFieldVO> fieldVOs) {

		if (fieldVOs == null || fieldVOs.isEmpty()) {
			return;
		}

		for (ApprovalFormFieldVO fieldVO : fieldVOs) {
			ApprovalFormFieldPO fieldPO = new ApprovalFormFieldPO();
			BeanUtil.copyProperties(fieldVO, fieldPO);
			fieldPO.setFormId(formId);
			fieldPO.setStatus(ApprovalFormFieldPO.STATUS_ENABLED_INT);
			approvalFormFieldDao.save(fieldPO);
		}
	}

	private ApprovalFormVO formPOToVO(ApprovalFormPO formPO) {
		ApprovalFormVO vo = new ApprovalFormVO();
		BeanUtil.copyProperties(formPO, vo);
		return vo;
	}

}
